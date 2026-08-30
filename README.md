# 🚀 To-Do Something (Full-Stack Architecture)

A decoupled, high-performance task management application migrated from legacy React class components into a modern, reactive client-server architecture powered by Vite, React Context API, and an Express.js backend.

---

## 🏛️ System Architecture & Data Flow
[ React Client (Port 5173) ]
│
│  HTTP Async Requests (fetch)
▼
[ Vite Reverse Proxy (/api -> :5000) ]
│
│  Local Loopback TCP Socket
▼
[ Express.js Server (Port 5000) ] ──► [ In-Memory Data Store (Single Source of Truth) ]

### Core Design Principles
* **Server-Authoritative State:** The backend acts as the authoritative state machine responsible for ID allocation, data mutations, and filtering logic.
* **Reactive Frontend Cache:** The React client acts as a lightweight local cache subscribed via Context API, enforcing immutable state transitions (`[...prev, data]`) for optimal Virtual DOM reconciliation.
* **Zero-CORS Development Proxy:** Vite acts as a reverse proxy during development, routing relative paths (`/api/*`) seamlessly to Express on port `5000`.

---

## 🛠️ Tech Stack

* **Frontend:** React 18, Vite, Context API, Hooks (`useState`, `useEffect`, `useContext`)
* **Backend:** Node.js (ES Modules), Express.js, CORS, Dotenv
* **Dev Tools:** Nodemon, Git, Browser DevTools

---

## 📡 API Specification

| Method | Endpoint | Request Body | Status Code | Description |
| :--- | :--- | :--- | :--- | :--- |
| **`GET`** | `/api/tasks` | *None* | `200 OK` | Retrieves all active tasks. |
| **`POST`** | `/api/tasks` | `{"task": "string"}` | `201 Created` | Appends a new task with a server-generated ID. |
| **`PATCH`** | `/api/tasks/:id` | `{"done": boolean}` or `{"task": "string"}` | `200 OK` | Updates status or text content by ID. |
| **`DELETE`** | `/api/tasks/:id` | *None* | `200 OK` | Purges a specific task by ID. |
| **`POST`** | `/api/tasks/mass-delete` | `{"type": "All" \| "Done"}` | `200 OK` | Batch deletes completed or all tasks. |

---

## ⚡ Quickstart & Local Execution

This project requires running both the client and server concurrently across two separate terminals.

### 1. Start the Backend Server
```bash
# Navigate to the backend directory
cd server

# Install backend dependencies
npm install

# Launch with Nodemon auto-reload
npm run dev