# Codesdev | Full-Stack Web IDE

> **⚠️ Status: Active Development**
>
> *Codesdev is a browser-based, full-stack Cloud IDE featuring a secure, containerized execution engine and intelligent file management.*

**Codesdev** brings a professional "local-feel" development experience to the web. Beyond just editing, it now features a **Polyglot Execution Sandbox** capable of running complex, multi-file projects in 8+ languages securely. Built with **React/TypeScript** and a robust **Python (Flask)** backend, it leverages Docker for both deployment and isolated user code execution.

---

## 🚀 Key Features

### ⚡ Polyglot Code Execution (New)
A secure, containerized runner that executes code in real-time.
* **Multi-Language Support:** Native execution for **Python, JavaScript, TypeScript, Ruby, Go, C, C++, and Java**.
* **Smart Path Resolution:** The engine intelligently handles nested directories, relative imports, and complex file structures (e.g., running `server/src/app.py` works seamlessly).
* **Isolated Sandboxing:** User code runs in ephemeral Docker containers with strict memory and network limits for security.

### 📁 Virtual File System (VFS)
A specialized file management engine built on **PostgreSQL JSONB** for high-performance structure handling.
* **Recursive Operations:** Create, rename, delete, and move nested files/folders.
* **Context Aware:** Right-click context menus, drag-and-drop resizing, and file tab management.
* **Command Palette:** Quick file navigation using `Ctrl/Cmd + P`.

### 💾 Versioning & Persistence
* **Auto-Save & Snapshots:** The IDE automatically creates checkpoints of your work.
* **Time Travel:** Browse project history and **restore** your workspace to any previous state instantly.
* **Forking:** Users can fork public projects to create their own independent copies.

### ⌨️ Professional Editor
Powered by the **Monaco Editor** (VS Code engine):
* **Intelligent Highlighting:** Syntax coloring for all supported languages.
* **Integrated Console:** Real-time stdout/stderr streaming from the execution engine.

---

## 🛠 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Tailwind CSS, Monaco Editor, Lucide Icons |
| **Backend** | Flask (Python), SQLAlchemy, Docker SDK for Python |
| **Database** | PostgreSQL (JSONB optimized for VFS) |
| **Execution** | Docker Containers (Ephemeral Runners) |
| **Security** | JWT (HttpOnly Cookies), CSRF Protection |

---

## 📦 Installation & Setup

The entire Codesdev environment (Frontend, Backend, DB, and Runners) is containerized using **Docker**.

### Prerequisites
* **Docker Desktop** (Must be running to support the execution engine)
* **Docker Compose**

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/ssmathoun/codesdev.git
cd codesdev

# 2. Create environment file
cp .env.example .env

# 3. Launch the stack
docker-compose up --build
```

* **App Entry:** [http://localhost](http://localhost) (via Nginx)
* **Direct Frontend (Dev):** [http://localhost:5173](http://localhost:5173)
* **Direct API:** [http://localhost:5001](http://localhost:5001)

---

## 🏗 System Architecture

### 1. The Execution Pipeline
When a user clicks "Run":
1.  **Bundle:** The frontend packages the file tree into a JSON payload.
2.  **Resolve:** The backend's **Robust Path Resolver** identifies the correct entry point (even in deep subdirectories).
3.  **Containerize:** A language-specific Docker container (e.g., `python:3.9-slim`) is spun up.
4.  **Execute:** The code is injected, executed, and the output is streamed back to the frontend console.
5.  **Cleanup:** The container is immediately destroyed to ensure isolation.

### 2. Data Persistence
* **JSONB Storage:** The entire project file tree is stored as a JSONB object in PostgreSQL, allowing for single-query retrieval of complex folder structures.
* **Optimistic UI:** The frontend updates instantly while syncing to the backend in the background.

---

## 🗺 Roadmap

- [x] **Secure Execution Sandbox:** Isolated container environment for running user code.
- [x] **Smart Path Resolution:** Support for relative imports and nested execution.
- [x] **Project Forking:** Ability to clone public projects.
- [ ] **Cloud Deployment:** Production hosting on **AWS EC2** (optimized for Docker execution) & **RDS**.
- [ ] **CI/CD Pipeline:** Automated deployment workflows via GitHub Actions.
- [ ] **Real-time Collaboration:** WebSocket integration for multi-user editing (Development Branch: `feat-collaboration`).
- [ ] **Interactive Terminal:** Full TTY support for user input during execution.

---

**Developed by Shabad Singh Mathoun** [GitHub](https://github.com/ssmathoun) | [LinkedIn](https://linkedin.com/in/shabad-mathoun)
