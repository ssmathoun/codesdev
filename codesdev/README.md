# Codesdev | Cloud Engineering IDE

> **⚠️ Status: Active Development**
> *Codesdev is a fully containerized, full-stack development environment designed for high-performance code management and persistence.*

**Codesdev** is a web-based IDE that brings a "local-feel" coding experience to the browser. Built with a **React/TypeScript** frontend and a **Python (Flask)** backend, it leverages a virtualized file system for seamless project organization and cloud-based persistence.

---

## 🛠 Tech Stack & Infrastructure

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Tailwind CSS, Monaco Editor |
| **Backend** | Flask (Python), SQLAlchemy, JWT Authentication |
| **Database** | PostgreSQL (JSONB optimized for VFS persistence) |
| **DevOps** | **Docker, Docker Compose, AWS (Planned Deployment)** |

---

## 📦 Containerized Setup (Recommended)

The entire CodesDev environment is containerized using **Docker**, ensuring consistency across all development and production environments.

### Prerequisites
* **Docker** and **Docker Compose**

### One-Command Start
```bash
# Clone the repository
git clone https://github.com/ssmathoun/codesdev.git
cd codesdev

# Launch all services (Frontend, Backend, Database)
docker-compose up --build
```

*The IDE will be accessible at [http://localhost](http://localhost) (Frontend) and [http://localhost:5001](http://localhost:5001) (API).*

## 🚀 Key Features

### 📁 Virtual File System (VFS)
A specialized file management engine built on **PostgreSQL JSONB** to handle complex, nested structures with high efficiency.
* **Recursive Management:** Create, rename, and move files/folders within a virtualized directory tree.
* **State Persistence:** Workspace layouts and file states are synchronized to ensure you pick up exactly where you left off.

### ⌨️ Professional-Grade Editor
Powered by the **Monaco Editor** engine for a robust coding experience:
* **Intelligent Highlighting:** Native support for Python, JavaScript, TypeScript, HTML, CSS and more.
* **Unified Console:** Integrated system feedback console for file operations and environment status.

### 🕒 Snapshot Versioning
Automated checkpointing that allows users to browse and manage historical versions of their workspace without interfering with the live environment.

---

## 🏗 System Architecture
* **Container Isolation:** Decoupled service architecture using **Docker** to separate the UI, Logic, and Data layers.
* **Virtualized Storage:** Optimized relational queries to map nested file structures into a high-performance React frontend.
* **Security:** Secure user sessions managed via **JWT-based authentication**.

---

## 🗺 Roadmap
- [ ] **Secure Execution Sandbox:** Isolated container environment for running user-submitted code safely.
- [ ] **CI/CD Pipeline:** Automated deployment workflows via **GitHub Actions**.
- [ ] **Real-time Collaboration:** WebSocket integration for multi-user presence (Development Branch: `feat-collaboration`).

---

**Developed by Shabad Singh Mathoun** [GitHub](https://github.com/ssmathoun) | [LinkedIn](https://linkedin.com/in/shabad-mathoun)
