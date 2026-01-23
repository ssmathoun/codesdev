# CodesDev | Professional Cloud-Integrated IDE

> **⚠️ Status: Active Development** > CodesDev is currently in **Active Development**. 

**CodesDev** is a real-time collaborative coding environment for developers, built to provide a seamless **"local-feel"** experience directly in the browser.

---

## 🚀 Key Features

### 🕒 Time Travel Versioning
Never lose a line of code again. CodesDev automatically captures snapshots of your workspace every 10 minutes. 
* **Checkpoints:** Create named milestones before major refactors.
* **Historical Preview:** Browse the entire file tree of a previous version without affecting your current live state.
* **Instant Restoration:** Revert your entire workspace to any point in time with a single click.

### 📁 Virtual File System (VFS)
Built on a high-performance **PostgreSQL JSONB** backbone, the file tree handles complex nested structures with zero latency. 
* **Recursive Management:** Create, rename, and move files/folders within a virtualized environment.
* **Smart Tabs:** Tab-state synchronization that prunes "ghost" files during history navigation.

### ⌨️ Intelligent Monaco Editor
Powered by the same core as VS Code, providing:
* **Multi-Language Detection:** Automatic syntax highlighting for `.py`, `.js`, `.ts`, `.tsx`, `.html`, `.css`, and more.
* **IDE Feel:** Customized sidebar gutters with high-precision resize handles and a unified output console.

> **Note:** Advanced features like **Real-time Collaboration** and **Cloud Execution** are currently in development.


## 🛠 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React, TypeScript, Tailwind CSS, Monaco Editor |
| **Backend** | Flask (Python), SQLAlchemy, Flask-JWT-Extended |
| **Database** | PostgreSQL (JSONB optimized for file-tree persistence) |

---

## 💻 Local Setup Instructions

### Prerequisites
* **Node.js** (v18.0 or higher)
* **Python** (v3.10 or higher)
* **PostgreSQL** (v14 or higher)

### 1. Server (Backend)
```bash
# Navigate to server directory
cd server

# Initialize Virtual Environment (if not already done)
python -m venv venv

# Activate Environment
# Mac/Linux:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# Install Dependencies
pip install -r requirements.txt

# Environment Setup
# Create a .env file in the /server directory and add:
# DATABASE_URL=postgresql://user:password@localhost:5432/codesdev
# SECRET_KEY=your_super_secret_key
# JWT_SECRET_KEY=your_jwt_secret_key

# Run Database Migrations
flask db upgrade

# Start Server
flask run --port=5001
```

### 2. Client (Frontend)
```bash
# Navigate to client directory
cd client

# Install Dependencies
npm install

# Start Development Server
npm run dev
```


## 🗺 Roadmap

- [ ] **Secure Sandbox:** Execution of code via isolated Docker-in-Docker containers to ensure system safety and resource isolation.
- [ ] **Real-time Sync:** Multi-user collaboration and presence using WebSockets (Socket.io) and Redis for scalable message broadcasting.
- [ ] **Deployment:** Fully automated CI/CD pipelines via GitHub Actions for seamless staging and production deployments.
- [ ] **Conflict Resolution:** Implementation of CRDTs (Conflict-free Replicated Data Types) to handle seamless concurrent editing without data loss.

---

**Developed by Shabad Singh Mathoun** [GitHub](https://github.com/ssmathoun) | [LinkedIn](https://linkedin.com/in/shabad-mathoun)
