# Codesdev | Full-Stack Web IDE

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg?style=flat-square)
![Status](https://img.shields.io/badge/status-live%20production-success.svg?style=flat-square)
![Build](https://img.shields.io/badge/build-passing-brightgreen.svg?style=flat-square)

<img width="100%" alt="Codesdev Editor" src="https://github.com/user-attachments/assets/9fe0d576-8c0a-4c21-9cde-a6c6e45efdab" />

> **🚀 Live Deployment:** [http://13.58.26.18](http://13.58.26.18)
> *(Hosted on AWS EC2)*

**Codesdev** is a browser-based integrated development environment (IDE) featuring a secure, containerized execution runtime. It allows users to write, compile, and run multi-file projects in 8+ languages directly from the web.

The system is built on a **microservices architecture** using **React 19** and **Flask**, orchestrated via **Docker Compose**. It demonstrates a production-grade DevOps workflow, featuring isolated sandboxing for code execution and automated CI/CD pipelines for deployment.

---

## ⚙️ Engineering Highlights

### ☁️ Cloud Infrastructure & DevOps
* **AWS Architecture:** Deployed on **AWS EC2** using Docker Compose to orchestrate separate services for the frontend, backend API, and database.
* **Reverse Proxy:** Implemented **Nginx** as the gateway to handle port forwarding, static asset serving, and strict CORS configuration between the React client and Flask API.
* **CI/CD Pipeline:** Configured **GitHub Actions** to automate linting, build verification, and zero-downtime SSH deployments to the production server upon merge.

### ⚡ Containerized Execution Engine
A custom backend service that manages ephemeral Docker containers for user code execution.
* **Isolated Sandboxing:** Leverages the **Docker SDK for Python** to spin up temporary containers for every execution request, ensuring complete process isolation and security.
* **Recursive Path Resolution:** Custom logic to resolve relative imports and nested directory paths, enabling the execution of complex, multi-file project structures (e.g., `src/modules/app.py`).
* **Polyglot Support:** Native runtime support for Python, JavaScript, TypeScript, Ruby, Go, C, C++, and Java.

### 📁 Virtual File System (VFS)
* **PostgreSQL JSONB:** Utilizes PostgreSQL's JSONB data type to store directory trees, allowing for atomic operations on nested structures without recursive SQL queries.
* **State Management:** Implements optimistic UI updates for file creation, renaming, and deletion, syncing state asynchronously with the database.

### 💾 Versioning & Persistence
* **Automated Checkpoints:** Implements an auto-save mechanism that captures periodic snapshots of the project file tree.
* **State Restoration:** Enables "Time Travel" debugging by allowing users to browse version history and roll back the workspace to previous states.
* **Project Forking:** Supports deep cloning of public projects, allowing users to instantiate independent copies of existing codebases for isolated development.

### 💻 Editor Integration
* **Monaco Editor:** Integrates the core VS Code editor engine for standard features like syntax highlighting, linting, and bracket matching.
* **Stream Handling:** Captures `stdout` and `stderr` from backend containers via HTTP/WebSocket and renders them to the integrated console in real-time.

---

## 🛠 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Infrastructure** | AWS EC2 (Ubuntu), Nginx, Docker Compose |
| **DevOps** | GitHub Actions (CI/CD), SSH, Docker Hub |
| **Frontend** | React 19, TypeScript, Tailwind CSS, Monaco Editor, Vite |
| **Backend** | Flask (Python), SQLAlchemy, Docker SDK |
| **Database** | PostgreSQL (JSONB) |

---

## 🏗 System Architecture

### 1. Cloud Deployment
The production environment runs as a containerized stack on AWS:
1.  **Nginx:** Entry point for all traffic; routes API requests to Flask and serves React static files.
2.  **Service Isolation:** Frontend and Backend run on an internal Docker network, inaccessible from the public internet except through the proxy.
3.  **Persistence:** User data and file structures are persisted via Docker volumes.

### 2. Execution Pipeline
When a user executes code:
1.  **Serialization:** The frontend bundles the current file tree state into a JSON payload.
2.  **Entry Point Resolution:** The backend parses the directory structure to identify the target file and dependencies.
3.  **Container Provisioning:** A language-specific Docker image (e.g., `python:3.9-slim`) is instantiated.
4.  **Execution & Teardown:** Code is injected and executed; output streams to the client, and the container is immediately destroyed to release resources.

---

## 📦 Local Development

To run the full stack locally:

### Prerequisites
* **Docker Desktop** (Required for the execution engine)
* **Docker Compose**

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/ssmathoun/codesdev.git
cd codesdev

# 2. Configure environment
cp .env.example .env

# 3. Build and Run
docker compose up --build
```

* **App Entry:** [http://localhost:3000](http://localhost:3000) (via Nginx)
* **API Endpoint:** [http://localhost:5001](http://localhost:5001)

---

## 🗺 Roadmap

### ✅ Completed (v1.0)
- [x] **Production Deployment:** AWS EC2 with Nginx Reverse Proxy.
- [x] **DevOps Pipeline:** Automated CI/CD via GitHub Actions.
- [x] **Context-Aware Runtime:** Recursive path resolution handling complex imports and nested structures.
- [x] **VFS Persistence:** PostgreSQL JSONB file system with state preservation.

### 🚧 In Progress (v1.1 - Stabilization)
- [ ] **Security Hardening:** Implementation of **HTTPS/SSL** via Let's Encrypt.
- [ ] **Advanced CI/CD:** Adding unit test gates, health checks, and pushing images to a **Docker Registry**.
- [ ] **Automated Quality Gates:** Enforcing Branch Protection rules to require successful CI builds before merging to `main`.

### 🔮 Future Engineering (v2.0)
- [ ] **Infrastructure Scaling:** Migrating the database to **AWS RDS** for high availability.
- [ ] **Real-time Collaboration:** WebSocket integration (Socket.io) for multi-user editing.
- [ ] **Interactive Terminal:** Full TTY support (xterm.js) for handling user input.
- [ ] **Accessibility:** Improving UI compliance with WCAG standards.

---

**Developed by Shabad Singh Mathoun** [GitHub](https://github.com/ssmathoun) | [LinkedIn](https://linkedin.com/in/shabad-mathoun)
