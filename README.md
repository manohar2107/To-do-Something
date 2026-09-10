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
│
│  Mongoose ODM (with Google DNS SRV Resolution)
▼
[ MongoDB Atlas Cloud Cluster ] ──► [ Persistent Document Collection: 'tasks' ]

### Core Design Principles
* **Cloud Database Persistence:** Server state transitions are fully persistent, backed by a managed multi-node replica set in MongoDB Atlas.
* **Server-Authoritative State:** The backend acts as the authoritative state machine responsible for ID allocation, data mutations, and filtering logic.
* **Reactive Frontend Cache:** The React client acts as a lightweight local cache subscribed via Context API, enforcing immutable state transitions (`[...prev, data]`) for optimal Virtual DOM reconciliation.
* **Zero-CORS Development Proxy:** Vite acts as a reverse proxy during development, routing relative paths (`/api/*`) seamlessly to Express on port `5000`.

---

## 🛠️ Tech Stack

* **Frontend:** React 18, Vite, Context API, Hooks (`useState`, `useEffect`, `useContext`)
* **Backend:** Node.js (ES Modules), Express.js, CORS, Dotenv
* **Database & ODM:** MongoDB Atlas (Cloud M0 Cluster), Mongoose 8+
* **Dev Tools:** Nodemon, Git, Browser DevTools

---

## 📡 API Specification

| Method | Endpoint | Request Body | Success Code | Description |
| :--- | :--- | :--- | :--- | :--- |
| **`GET`** | `/api/tasks` | *None* | `200 OK` | Hydrates tasks sorted by `createdAt` descending. |
| **`POST`** | `/api/tasks` | `{"task": "string"}` | `201 Created` | Validates text and persists a new document. |
| **`PATCH`** | `/api/tasks/:id` | `{"done": boolean}` or `{"task": "string"}` | `200 OK` | Updates status or text by validated ObjectId. |
| **`DELETE`** | `/api/tasks/:id` | *None* | `200 OK` | Removes document matching ObjectId. |
| **`POST`** | `/api/tasks/mass-delete` | `{"type": "All" \| "Done"}` | `200 OK` | Executes batch document purge via `deleteMany()`. |

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


---

## 🌐 Production Cloud Architecture & CI/CD

The application is deployed across a decoupled multi-cloud architecture:

* **Frontend Hosting:** [Vercel](https://to-do-something-pearl.vercel.app) (Edge CDN with SPA fallbacks)
* **Backend API:** [Google Cloud Run](https://todo-something-714330462911.asia-south2.run.app) (Serverless containerized Express service in `asia-south2`)
* **Persistence:** [MongoDB Atlas](https://cloud.mongodb.com) (Multi-node M0 replica set)
* **Reverse Proxy:** Configured via `vercel.json` to proxy `/api/*` requests directly to Cloud Run, eliminating cross-origin preflight latency and CORS restrictions.

### Continuous Deployment Pipeline

Deployments follow a strict Git tag promotion workflow to prevent unstable code from leaking into production:

1. **Active Development:** All daily commits and feature experiments remain on `master`.
2. **Release Staging:** Stable milestones are merged from `master` into the `deploy` branch.
3. **Automated Builds:** Pushing an annotated tag matching `^v.*` (e.g., `git push origin v0.3.0`) triggers Google Cloud Build to:
   * Build the production Docker image using `server/Dockerfile`.
   * Push the container artifact to Google Artifact Registry.
   * Roll out a zero-downtime revision on Google Cloud Run.