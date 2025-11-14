# Chat Engine

**Overview**
- NestJS WebSocket demo with Prisma and PostgreSQL.
- Core models: `User`, `User_PII`, `Message` (focus for the demo).
- Emits `receive_message` when a client sends `send_message`.

**Requirements**
- Node `>= 18` and npm `>= 9` (project tested with Node 18.16.0, npm 9.5.1).
- PostgreSQL connection URL in `.env` (`DATABASE_URL`).
- Optional: Docker Desktop (for `docker compose`).

**Setup**
- Install dependencies (PowerShell):
	- `Set-Location -Path "c:\Users\yunhu\OneDrive\Documents\GitHub\Chat-engine-team"`
	- `npm install`

**Environment**
- Create `.env` in the project root with your database URL:
	- `DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DBNAME?schema=public"`

**Prisma**
- Generate client:
	- `npm run prisma:generate`
- Run a dev migration (optional, requires a running PostgreSQL):
	- `npm run prisma:migrate`

**Run (without Docker)**
- Start Nest dev server:
	- `npm run start:dev`
- Default Nest port is `3000` unless overridden.

**WebSocket API**
- Event to send: `send_message`
	- Payload: `{ author_id: string, receiver_id: string, body: string }`
- Event received by all clients: `receive_message`
	- Payload: the saved `Message` entity.

**Docker (optional)**
- After installing Docker Desktop, run:
	- `docker compose up --build`
- If `docker` is not recognized, install/start Docker Desktop and try again.

**NPM Scripts**
- `start:dev`: Run Nest in watch mode.
- `build`: Build the project.
- `prisma:generate`: Generate Prisma Client.
- `prisma:migrate`: Create/apply a dev migration (`prisma migrate dev --name init`).

**Troubleshooting**
- Prisma schema location: file is at `prisma/schema.prisma`. Use `npm run prisma:generate`.
- NPM audit warnings: low/moderate dev-chain issues are fine for a demo. To reduce noise:
	- `npm audit` or `npm audit fix` (use `--force` only if acceptable).
	- `npm config set audit false` (to suppress audit during installs).
- Docker not found: install Docker Desktop and use `docker compose up --build`.


