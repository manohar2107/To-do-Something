```markdown
---
# 📋 Changelog

All notable changes to the **To-Do Something** project will be documented in this file.

---

## [0.2.0] - 2026-08-30

### Added
* **Express.js Backend Service:** Dedicated Node.js backend workspace configured in `/server` utilizing modern ES Modules.
* **Full-Stack CRUD Endpoints:**
  * `GET /api/tasks` (Data hydration)
  * `POST /api/tasks` (Task creation with server-generated IDs)
  * `PATCH /api/tasks/:id` (Inline editing and completion toggle)
  * `DELETE /api/tasks/:id` (Single task removal)
  * `POST /api/tasks/mass-delete` (Batch deletion pipeline)
* **Vite Reverse Proxy:** Configured `vite.config.js` with `/api` proxy mapping to `http://localhost:5000`, eliminating cross-origin overhead during local development.
* **Network Logging Middleware:** Integrated terminal request logging with timestamps and payload metadata in Express.

### Changed
* **State Management Architecture:** Shifted from redundant client-side `useReducer` to a server-authoritative pattern where Express memory acts as the primary data store and `useState` acts as a reactive local cache.
* **Context Modernization:** Refactored `TodoContext.jsx` to expose unified asynchronous network handlers (`addTask`, `toggleTask`, `editTaskText`, `deleteStandardTask`, `massClearTasks`).
* **Immutability Hardening:** Replaced direct array operations with functional state updaters and the spread operator (`...`) to resolve Virtual DOM reconciliation bailing and ensure instant re-rendering.

### Fixed
* Fixed proxy connection drops (`ECONNREFUSED`) by aligning client-server startup pipelines.
* Resolved `ERR_SSL_PROTOCOL_ERROR` by standardizing plaintext HTTP protocols across local port bindings.
* Fixed body-parser silent failure by prioritizing `app.use(express.json())` middleware before route definitions.

---

## [0.1.0] - 2026-08-28

### Added
* **Vite Migration:** Replaced Create React App with Vite for instant server starts and HMR.
* **Context API & Reducer Pipeline:** Engineered `TodoProvider` and `todoReducer.js` to eliminate prop-drilling across `ToDoInput`, `ToDoList`, and `Lists` components.
* **Git Version Control:** Configured `.gitignore` and CRLF/LF line-ending normalization for cross-platform development.

### Changed
* **Class to Functional Components:** Converted all React class components into functional components utilizing modern React Hooks.

---

## [0.0.1] - Legacy Baseline

### Added
* Legacy single-page to-do application utilizing React class components, `this.setState`, and manual function binding.