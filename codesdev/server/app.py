import os
import docker
import uuid
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
from sqlalchemy import select, String, Integer, DateTime, ForeignKey, Text, Boolean, func, delete, or_
from sqlalchemy.orm import Mapped, mapped_column, relationship, DeclarativeBase
from sqlalchemy.orm.attributes import flag_modified
from dotenv import load_dotenv
from datetime import datetime
from typing import Optional, List

# Load Environment Variables
load_dotenv()

# Define the Declarative Base
class Base(DeclarativeBase):
    pass

# Initialize Flask App
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
app.config['JWT_COOKIE_HTTPONLY'] = True   # Access token stays secure
app.config['JWT_CSRF_CHECK_FORM'] = False # We use headers, not forms
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=2)
app.config['JWT_CSRF_COOKIE_HTTPONLY'] = False # This allows document.cookie to see it
app.config['JWT_ACCESS_CSRF_HEADER_NAME'] = "X-CSRF-TOKEN"
app.config['JWT_CSRF_IN_COOKIES'] = True

# Initialize Extensions
db = SQLAlchemy(app, model_class=Base)
migrate = Migrate(app, db)
jwt = JWTManager(app)

# Define all possible places your frontend might run
allowed_origins = [
    "http://localhost",           # Docker/Nginx (Port 80)
    "http://localhost:5173",      # Vite Local Dev
    "http://127.0.0.1",           # IP based access
    "http://127.0.0.1:5173",
    os.environ.get("CORS_ORIGIN") # Environment variable backup
]

# Configure CORS with the list
CORS(app, supports_credentials=True, origins=allowed_origins, methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

client = docker.from_env()

LANGUAGE_CONFIG = {
    "python": {
        "image": "python:3.12-slim",
        "command": ["sh", "-c", "echo \"$CODE\" > main.py && python main.py"],
    },
    "javascript": {
        "image": "node:20-slim",
        "command": ["sh", "-c", "echo \"$CODE\" > index.js && node index.js"],
    },
    "typescript": {
        "image": "node:20-slim", # We use Node to run simple TS (via ts-node if installed, or just treating as JS)
        "command": ["sh", "-c", "echo \"$CODE\" > index.js && node index.js"], 
    },
    "ruby": {
        "image": "ruby:3.2-slim",
        "command": ["sh", "-c", "echo \"$CODE\" > script.rb && ruby script.rb"],
    },
    "go": {
        "image": "golang:1.22-alpine",
        "command": ["sh", "-c", "echo \"$CODE\" > main.go && go run main.go"],
    },
    "c": {
        "image": "gcc:13", # GCC image handles both C and C++
        "command": ["sh", "-c", "echo \"$CODE\" > main.c && gcc main.c -o app && ./app"],
    },
    "cpp": {
        "image": "gcc:13",
        "command": ["sh", "-c", "echo \"$CODE\" > main.cpp && g++ main.cpp -o app && ./app"],
    },
    "java": {
        "image": "eclipse-temurin:21-jdk",
        "command": ["sh", "-c", "echo \"$CODE\" > Main.java && javac Main.java && java Main"],
    }
}

# Database Models
class User(db.Model):
    __tablename__ = 'users'

    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(80), unique=True, nullable=False)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    avatar_id: Mapped[Optional[str]] = mapped_column(String(50), default="default")
    avatar_url: Mapped[Optional[str]] = mapped_column(Text)
    
    # Explicit 2.0 relationship
    projects: Mapped[List["Project"]] = relationship(back_populates="owner", cascade="all, delete-orphan")

class Project(db.Model):
    __tablename__ = 'projects'

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    file_tree: Mapped[dict] = mapped_column(JSONB, nullable=False, default=list)
    user_id: Mapped[int] = mapped_column(ForeignKey('users.id'), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    is_public: Mapped[bool] = mapped_column(Boolean, default=False)
    owner: Mapped["User"] = relationship(back_populates="projects")
    versions: Mapped[List["Version"]] = relationship(back_populates="project", cascade="all, delete-orphan")

class TokenBlocklist(db.Model):
    __tablename__ = 'token_blocklist'
    id: Mapped[int] = mapped_column(primary_key=True)
    jti: Mapped[str] = mapped_column(String(36), nullable=False, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

class Version(db.Model):
    __tablename__ = 'versions'
    id: Mapped[int] = mapped_column(primary_key=True)
    project_id: Mapped[int] = mapped_column(ForeignKey('projects.id'), nullable=False)
    file_tree_snapshot: Mapped[dict] = mapped_column(JSONB, nullable=False)
    label: Mapped[Optional[str]] = mapped_column(String(100), nullable=True, default=None) 
    created_at: Mapped[datetime] = mapped_column(DateTime, default=func.now())
    project: Mapped["Project"] = relationship(back_populates="versions")

# JWT Revocation Check
@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload: dict) -> bool:
    jti = jwt_payload["jti"]
    token = db.session.scalar(select(TokenBlocklist).filter_by(jti=jti))
    return token is not None

# Auth Routes
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if db.session.scalar(select(User).filter_by(email=data['email'])):
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
    user = db.session.scalar(select(User).filter_by(email=data['email']))
    
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
    current_user_id = int(get_jwt_identity())
    user_projects = db.session.scalars(select(Project).filter_by(user_id=current_user_id)).all()
    return jsonify([{
        "id": p.id, 
        "name": p.name, 
        "file_tree": p.file_tree,
        "created_at": p.created_at.isoformat() + 'Z'
    } for p in user_projects]), 200

@app.route('/api/projects/<int:project_id>', methods=['GET'])
@jwt_required(optional=True)
def get_single_project(project_id):
    current_user_id = get_jwt_identity()
    
    project = db.session.get(Project, project_id)
    
    if not project:
        return jsonify({"msg": "Project not found"}), 404
    
    print(f"DEBUG CHECK: Token User={current_user_id} (Type: {type(current_user_id)}) vs Project Owner={project.user_id}", flush=True)

    # Permission Logic
    is_owner = False
    if current_user_id and int(current_user_id) == project.user_id:
        is_owner = True

    if not is_owner and not project.is_public:
        return jsonify({"msg": "Unauthorized"}), 403
    
    return jsonify({
        "id": project.id,
        "name": project.name,
        "file_tree": project.file_tree,
        "created_at": project.created_at.isoformat() + 'Z' if project.created_at else None,
        "is_public": project.is_public,
        "is_owner": is_owner
    }), 200

@app.route('/api/projects', methods=['POST'])
@jwt_required()
def create_project():
    current_user_id = int(get_jwt_identity())
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
    user_id = int(get_jwt_identity())
    user = db.session.get(User, user_id)
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
    current_user_id = int(get_jwt_identity())
    project = db.session.scalar(
        select(Project).where(Project.id == project_id, Project.user_id == current_user_id)
    )
    
    if not project:
        # If the project exists but belongs to someone else, this returns None
        # effectively hiding it and preventing edits (returns 404 or 403)
        return jsonify({"msg": "Project not found or unauthorized"}), 404
    
    data = request.get_json()
    
    if 'file_tree' in data:
        project.file_tree = data['file_tree']
        flag_modified(project, "file_tree")
    
    if 'name' in data:
        project.name = data['name']
        
    db.session.commit()
    return jsonify({"msg": "Persistence updated"}), 200

@app.route('/api/projects/<int:project_id>', methods=['DELETE'])
@jwt_required()
def delete_project(project_id):
    current_user_id = int(get_jwt_identity())
    project = db.session.scalar(
    select(Project).where(Project.id == project_id, Project.user_id == current_user_id)
    )
    if not project:
        return jsonify({"msg": "Project not found"}), 404
    
    db.session.delete(project)
    db.session.commit()
    return jsonify({"msg": "Project deleted"}), 200

@app.route('/api/user/update', methods=['PUT'])
@jwt_required()
def update_user_profile():
    current_user_id = int(get_jwt_identity())
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

@app.route('/api/projects/<int:project_id>/version', methods=['POST'])
@jwt_required()
def save_version(project_id):
    current_user_id = int(get_jwt_identity())
    
    # Fetch project
    project = db.session.scalar(
        select(Project).where(Project.id == project_id, Project.user_id == current_user_id)
    )
    if not project:
        return jsonify({"msg": "Project not found"}), 404

    data = request.get_json()
    
    # Handle the Label
    # If the frontend sends an empty string, we force it to None
    raw_label = data.get('label')
    version_label = raw_label if raw_label and raw_label.strip() != "" else None

    new_version = Version(
        project_id=project.id,
        file_tree_snapshot=data.get('file_tree', project.file_tree),
        label=version_label
    )
    db.session.add(new_version)

    # The Cleanup
    # We use func.now() for database-level time consistency
    cutoff = datetime.utcnow() - timedelta(hours=24)
    
    cleanup_stmt = (
        delete(Version)
        .where(Version.project_id == project_id)
        .where(Version.label == None)  # Targets only actual autosaves
        .where(Version.created_at < cutoff)
    )
    
    db.session.execute(cleanup_stmt)
    
    # Commit both the New Save and the Cleanup in one transaction
    db.session.commit()
    
    return jsonify({"msg": "Checkpoint created", "id": new_version.id}), 201

@app.route('/api/versions/<int:version_id>/revert', methods=['POST'])
@jwt_required()
def revert_to_version(version_id):
    version = Version.query.get_or_404(version_id)
    project = Project.query.get(version.project_id)
    
    # Overwrite live project state with the snapshot
    project.file_tree = version.file_tree_snapshot
    db.session.commit()
    return jsonify({"msg": "Project reverted", "file_tree": project.file_tree}), 200

@app.route('/api/projects/<int:project_id>/history', methods=['GET'])
@jwt_required()
def get_project_history(project_id):
    current_user_id = int(get_jwt_identity())
    
    # Ensure the project belongs to the user
    project = db.session.scalar(
    select(Project).where(Project.id == project_id, Project.user_id == current_user_id)
    )
    if not project:
        return jsonify({"msg": "Project not found"}), 404
    
    versions = Version.query.filter_by(project_id=project_id).order_by(Version.created_at.desc()).all()
    
    return jsonify([{
        "id": v.id,
        "label": v.label,
        "created_at": v.created_at.isoformat() + 'Z'
    } for v in versions]), 200

@app.route('/api/versions/<int:version_id>', methods=['GET'])
@jwt_required()
def get_version_details(version_id):
    current_user_id = int(get_jwt_identity())
    version = Version.query.get_or_404(version_id)
    project = Project.query.get(version.project_id)
    
    if project.user_id != current_user_id:
        return jsonify({"msg": "Unauthorized"}), 403

    return jsonify({
        "id": version.id,
        "label": version.label,
        "file_tree_snapshot": version.file_tree_snapshot,
        "created_at": version.created_at.isoformat()
    }), 200

@app.route('/api/projects/<int:project_id>/share', methods=['PUT'])
@jwt_required()
def toggle_project_visibility(project_id):
    current_user_id = int(get_jwt_identity())
    
    # Check if user owns the project
    project = db.session.scalar(
        select(Project).where(Project.id == project_id, Project.user_id == current_user_id)
    )
    
    if not project:
        return jsonify({"msg": "Project not found"}), 404
        
    data = request.get_json()
    project.is_public = data.get('is_public', False)
    db.session.commit()
    
    return jsonify({"msg": "Visibility updated", "is_public": project.is_public}), 200

@app.route('/api/projects/<int:project_id>/fork', methods=['POST'])
@jwt_required()
def fork_project(project_id):
    current_user_id = int(get_jwt_identity())
    
    # Get the original project
    # It must be public or owned by the current user
    source_project = db.session.scalar(
        select(Project).where(
            Project.id == project_id,
            or_(Project.is_public == True, Project.user_id == current_user_id)
        )
    )
    
    if not source_project:
        return jsonify({"msg": "Project not found or private"}), 404

    # Create a Copy
    new_name = f"{source_project.name} (Fork)"
    if source_project.user_id == current_user_id:
        new_name = f"{source_project.name} (Copy)"

    forked_project = Project(
        name=new_name,
        user_id=current_user_id,            # Assign to the person clicking "Fork"
        file_tree=source_project.file_tree, # Copy the file structure
        is_public=False                     # Reset to Private
    )
    
    db.session.add(forked_project)
    db.session.commit()
    
    return jsonify({
        "msg": "Fork created", 
        "id": forked_project.id, 
        "name": forked_project.name
    }), 201

@app.route('/api/execute', methods=['POST'])
@jwt_required()
def execute_code_route():
    data = request.get_json()
    
    language = data.get('language')
    code = data.get('code')
    
    # Validation
    if not language or not code:
        return jsonify({"error": "Missing 'language' or 'code' field"}), 400
        
    config = LANGUAGE_CONFIG.get(language)
    if not config:
        return jsonify({"error": f"Language '{language}' is not supported for server-side execution."}), 400

    container = None

    try:
        # Run Container Securely
        # We pass the code as an Environment Variable ($CODE) to avoid complex file mounting issues
        container = client.containers.run(
            image=config['image'],
            command=config['command'],
            environment={"CODE": code},  # Inject code into the container
            mem_limit="128m",            # Limit RAM to 128MB
            network_disabled=True,       # Block Internet Access
            detach=True,                 # Run in background
            tty=False
        )

        # 3. Wait for result (Timeout after 5 seconds)
        try:
            result = container.wait(timeout=5)
            exit_code = result.get('StatusCode', 1)
        except Exception:
            container.kill()
            return jsonify({"output": "Error: Execution Timed Out (Limit: 5s)", "exit_code": 124})

        # 4. Get Logs (Output)
        logs = container.logs().decode('utf-8')
        
        return jsonify({
            "output": logs if logs else "No output returned.",
            "exit_code": exit_code
        })

    except docker.errors.ImageNotFound:
        return jsonify({"error": f"Docker image for {language} not found. Please contact admin."}), 500
    except Exception as e:
        return jsonify({"error": f"Execution failed: {str(e)}"}), 500
        
    finally:
        # Cleanup
        if container:
            try:
                container.remove(force=True)
            except:
                pass

            
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)