Containerization to Binary Execution
When deploying to Google Cloud Run, your raw JavaScript files are packaged and executed through a containerized build and runtime pipeline:

[ Git Tag Pushed ]
       │
       ▼
[ Google Cloud Build Engine ]
       │  1. Pulls repo at tagged commit
       │  2. Executes 'server/Dockerfile'
       │  3. Compiles Alpine Linux + Node.js binary + node_modules
       ▼
[ Artifact Registry ] ──► Stores immutable OCI container image snapshot
       │
       ▼
[ Google Cloud Run Runtime ]
       │  1. Pulls image into a secure gVisor sandbox / microVM
       │  2. Injects PORT (8080) and MONGO_URI
       │  3. Executes CMD ["npm", "start"] -> Node.js event loop boots
       ▼
[ Google Global Load Balancer ] ──► Exposes public HTTPS endpoint (auto-scales to 0 when idle)