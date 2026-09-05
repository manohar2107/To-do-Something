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

Deplyoing Steps:
# 1. Ensure you are on main with all latest changes committed
git checkout main

# 2. Create and switch to a new branch named 'depl'
git checkout -b dep

# 3. Push the new deploy branch to GitHub
git push -u origin dep

Cut and Push the Release Tag from the Deploy Branch:
# 4. Verify you are on the deploy branch
git branch --show-current

# 5. Create the annotated release tag
git tag -a v0.3.0 -m "Release v0.3.0: Cloud Run containerized backend with MongoDB Atlas"

# 6. Push the tag to GitHub
git push origin v0.3.0

Example:
Service [todo-something] revision [todo-something-00003-c7r] has been deployed and is serving 100 percent of traffic.
Service URL: https://todo-something-714330462911.asia-south2.run.app
Proxy locally with: gcloud run services proxy todo-something --region asia-south2 --project todoserver-507719