import os
from datetime import timedelta
from flask import Flask, request, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import (
    JWTManager, create_access_token, set_access_cookies,
    unset_jwt_cookies, jwt_required, get_jwt_identity, get_jwt
)
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.dialects.postgresql import JSONB
from dotenv import load_dotenv
from datetime import datetime

# Load Environment Variables
load_dotenv()

app = Flask(__name__)

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

# JWT and Cookie Security Configuration
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
app.config['JWT_TOKEN_LOCATION'] = ['cookies']
app.config['JWT_ACCESS_COOKIE_PATH'] = '/'
app.config['JWT_REFRESH_COOKIE_PATH'] = '/api/token/refresh'
app.config['JWT_COOKIE_CSRF_PROTECT'] = True  # Enable CSRF protection
app.config['JWT_COOKIE_SECURE'] = False       # Set to True in Production (HTTPS)
app.config['JWT_COOKIE_SAMESITE'] = 'Lax'
app.config['JWT_COOKIE_HTTPONLY'] = False  # Access token stays secure
app.config['JWT_CSRF_CHECK_FORM'] = False # We use headers, not forms
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=2)
app.config['JWT_CSRF_COOKIE_HTTPONLY'] = False # This allows document.cookie to see it
app.config['JWT_ACCESS_CSRF_HEADER_NAME'] = "X-CSRF-TOKEN"
app.config['JWT_CSRF_IN_COOKIES'] = True

# Initialize Extensions
db = SQLAlchemy(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)

# Configure CORS to allow cookies from the React Spoke
CORS(app, supports_credentials=True, origins=[
    "http://localhost:5173",
    "http://127.0.0.1:5173"
], methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

# Database Models
class User(db.Model):
    __tablename__ = 'users'
    __table_args__ = {'extend_existing': True} 

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    avatar_id = db.Column(db.String(50), nullable=True, default="default")
    avatar_url = db.Column(db.Text, nullable=True) 
    projects = db.relationship('Project', backref='owner', lazy=True)

class Project(db.Model):
    __tablename__ = 'projects'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    # JSONB for high-performance file tree persistence
    file_tree = db.Column(JSONB, nullable=False, default=lambda: [])
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class TokenBlocklist(db.Model):
    __tablename__ = 'token_blocklist'
    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(36), nullable=False, index=True)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

# JWT Revocation Check
@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload: dict) -> bool:
    jti = jwt_payload["jti"]
    token = db.session.query(TokenBlocklist.id).filter_by(jti=jti).scalar()
    return token is not None

# Auth Routes
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"msg": "Registration failed: User already exists"}), 400
    
    hashed_pw = generate_password_hash(data['password'])
    
    # Extract avatar data from the request
    new_user = User(
        username=data['username'],
        email=data['email'],
        password_hash=hashed_pw,
        avatar_id=data.get('avatar_id', 'default'),
        avatar_url=data.get('avatar_url') # Base64 string from custom upload
    )
    
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"msg": "User initialized successfully"}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    
    if user and check_password_hash(user.password_hash, data['password']):
        access_token = create_access_token(identity=str(user.id))
        response = jsonify({"msg": "Authentication successful", "username": user.username})
        # Sets the HTTP-only cookie in the user's browser
        set_access_cookies(response, access_token)
        return response, 200
    
    return jsonify({"msg": "Invalid credentials"}), 401

@app.route('/api/logout', methods=['POST'])
@jwt_required()
def logout():
    jti = get_jwt()["jti"]
    db.session.add(TokenBlocklist(jti=jti))
    db.session.commit()
    
    response = jsonify({"msg": "Session terminated"})
    unset_jwt_cookies(response)
    return response, 200

# Persistence Routes
@app.route('/api/projects', methods=['GET'])
@jwt_required()
def get_projects():
    current_user_id = get_jwt_identity()
    user_projects = Project.query.filter_by(user_id=current_user_id).all()
    return jsonify([{
        "id": p.id, 
        "name": p.name, 
        "file_tree": p.file_tree,
        "created_at": p.created_at.isoformat() + 'Z'
    } for p in user_projects]), 200

@app.route('/api/projects/<int:project_id>', methods=['GET']) # MUST include GET
@jwt_required()
def get_single_project(project_id):
    current_user_id = get_jwt_identity()
    
    # Ensure the project belongs to the logged-in user
    project = Project.query.filter_by(id=project_id, user_id=current_user_id).first_or_404()
    
    return jsonify({
        "id": project.id,
        "name": project.name,
        "file_tree": project.file_tree,
        "created_at": project.created_at.isoformat() + 'Z' if project.created_at else None
    }), 200

@app.route('/api/projects', methods=['POST'])
@jwt_required()
def create_project():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    new_project = Project(
        name=data.get('name', 'untitled-project'),
        user_id=current_user_id,
        file_tree=[] # Initial empty workspace
    )
    
    db.session.add(new_project)
    db.session.commit()
    return jsonify({"id": new_project.id, "name": new_project.name, "created_at": new_project.created_at.isoformat() + 'Z'}), 201

@app.route('/api/me', methods=['GET'])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404
        
    return jsonify({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "avatar_id": user.avatar_id,
        "avatar_url": user.avatar_url
    }), 200

@app.route('/api/projects/<int:project_id>', methods=['PUT'])
@jwt_required()
def update_project(project_id):
    current_user_id = get_jwt_identity()
    project = Project.query.filter_by(id=project_id, user_id=current_user_id).first_or_404()
    
    data = request.get_json()
    
    # Update the JSONB blob
    if 'file_tree' in data:
        project.file_tree = data['file_tree']
    
    if 'name' in data:
        project.name = data['name']
        
    db.session.commit()
    return jsonify({"msg": "Persistence updated"}), 200

@app.route('/api/projects/<int:project_id>', methods=['DELETE'])
@jwt_required()
def delete_project(project_id):
    current_user_id = get_jwt_identity()
    project = Project.query.filter_by(id=project_id, user_id=current_user_id).first_or_404()
    
    db.session.delete(project)
    db.session.commit()
    return jsonify({"msg": "Project deleted"}), 200

@app.route('/api/user/update', methods=['PUT'])
@jwt_required()
def update_user_profile():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    data = request.get_json()

    # Identity updates
    if 'username' in data: user.username = data['username']
    if 'email' in data: user.email = data['email']
    
    # Avatar logic
    if 'avatar_id' in data: user.avatar_id = data['avatar_id']
    if 'avatar_url' in data: user.avatar_url = data['avatar_url']

    # Password update logic
    if data.get('new_password'):
        if not data.get('old_password') or not check_password_hash(user.password_hash, data.get('old_password')):
            return jsonify({"msg": "Current password required to set a new one"}), 400
        
        user.password_hash = generate_password_hash(data['new_password'])

    db.session.commit()
    return jsonify({"msg": "Profile updated successfully"}), 200

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5001)