```markdown
---
# 📋 Changelog

All notable changes to the **To-Do Something** project will be documented in this file.

---
## [Unreleased] - 2026-09-08

### Added
- **JWT Authentication Pipeline**: Created `/api/auth/register`, `/api/auth/login`, and `/api/auth/me` routes with token generation and session hydration.
- **User Model & Security**: Implemented `User` schema with unique `username` validation, automatic `theme` preference assignment, and `bcryptjs` password hashing.
- **Token Verification Middleware**: Added `authenticateToken` middleware to decode Bearer tokens, query the authenticated user, and inject `req.user` into downstream handlers.
- **Database Environment Isolation**: Separated local development data into a dedicated `todo_dev` database on MongoDB Atlas via environment variables to protect production records.

### Changed
- **Task Route Scoping**: Mounted all `/api/tasks` endpoints behind the `authenticatedToken` middleware and isolated queries and creations to `req.user._id`.
- **Express Middleware Ordering**: Restructured `server.js` to ensure `express.json()` and `cors()` execute prior to route handlers.

### Fixed
- Resolved `TypeError: next is not a function` in `User.js` by migrating the `pre('save')` hook to a modern promise-based async implementation without `next()`.
- Removed legacy unauthenticated task route handlers directly declared inside `server.js`.

## [0.3.0] - 2026-09-03

### Added
* **MongoDB Atlas Integration:** Swapped ephemeral in-memory storage for a persistent MongoDB Atlas cloud database cluster using Mongoose ODM.
* **Mongoose Task Schema:** Implemented `Task` schema (`server/models/Task.js`) with validation constraints for `task` (required, trimmed), `done` (boolean flag), and automatic `timestamps`.
* **DNS Resolution Fix:** Added native Node.js DNS override (`dns.setServers(['8.8.8.8', '8.8.4.4'])`) to bypass residential ISP blocking of DNS SRV records for `+srv` connection strings.
* **ObjectId Validation Guards:** Introduced `mongoose.Types.ObjectId.isValid` parameter checks across `PATCH` and `DELETE` endpoints to reject malformed IDs before executing queries.

### Changed
* **Mongoose 8+ Driver Compliance:** Migrated update queries from the deprecated `{ new: true }` option to `{ returnDocument: 'after' }` in `findByIdAndUpdate()`.
* **Cross-Property ID Resilience:** Updated `TodoContext.jsx` and `Lists.jsx` to resolve IDs defensively using `(t.id || t._id)` to avoid synchronization failures between Mongoose documents and frontend state.
* **Strict Response Verification:** Added `response.ok` validation guards across all context network handlers, preventing server error payloads from being written to client state.
* **Input State Normalization:** Normalized checkbox checked bindings using `Boolean(list.done)` to prevent React controlled-to-uncontrolled input conversion warnings.

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