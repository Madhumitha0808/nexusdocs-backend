# nexusdocs-backend

Node.js backend for NexusDocs.

## Quick start (local)

1. Copy `.env.example` to `.env` and edit values.
2. Install deps: `npm install`
3. Start: `node src/index.js` or `npm run dev` (if nodemon installed)
4. Endpoints:
   - POST /auth/register
   - POST /auth/login
   - POST /api/upload (multipart form, field name: file)
