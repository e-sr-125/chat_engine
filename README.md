# Chat Engine

Lightweight NestJS + WebSocket + Prisma demo focused on three models (`User`, `User_PII`, `Message`) and real‑time message broadcasting.

## Tech Stack
- NestJS (Express platform + Socket.IO)
- Prisma ORM (PostgreSQL)
- PostgreSQL (local container or external)
- Redis (reserved for future caching / pub‑sub)
- Docker Compose (optional convenience stack)

## Features
- WebSocket event `send_message` → persists message → server broadcasts `receive_message` to all clients.
- REST endpoint: `GET /messages/:id` returns messages authored by or sent to the given user id (simple demo logic).
- Self‑reply support (parent message structure prepared in schema).

## Project Structure (excerpt)
```
src/
  app.module.ts        # Root module wiring Auth/Chat/Message modules
  auth/                 # Auth placeholder module
  chat/                 # WebSocket gateway + service
  message/              # REST controller + service
prisma/
  schema.prisma         # User, User_PII, Message models + enum
Dockerfile              # Multi-stage-ish simple build (Node 18 + OpenSSL)
docker-compose.yml      # api + db + redis services
```

## Requirements
- Node ≥ 18, npm ≥ 9 (tested: Node 18.16.0 / npm 9.5.1)
- PostgreSQL reachable (via Docker `db` service or local install)
- `.env` file with `DATABASE_URL`
- Optional: ngrok (for external tunnel) & Docker Desktop

## Environment Setup
Create `.env`:
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/chatdb?schema=public
JWT_SECRET=secret123
REDIS_URL=redis://localhost:6379
```
When running entirely inside Docker containers, the API uses the Compose network hostname:
```
DATABASE_URL=postgresql://postgres:postgres@db:5432/chatdb?schema=public
```

## Install & Dev (Host Only)
```powershell
npm install
npm run prisma:generate
docker compose up -d db   # if using container Postgres
npm run prisma:migrate    # if DATABASE_URL points to localhost
npm run start:dev
```
App listens on `http://localhost:3000`.



## Docker Workflow
Build & run everything:
```powershell
docker compose up --build
```
Run Prisma migrate inside container (uses `db:5432`):
```powershell
docker compose run --rm api npx prisma migrate dev --name init
```
Rebuild after Dockerfile edits:
```powershell
docker compose build --no-cache api
```

## NPM Scripts
| Script | Purpose |
|--------|---------|
| `start:dev` | Run Nest in watch mode |
| `build` | Compile to `dist/` |
| `prisma:generate` | Generate Prisma client |
| `prisma:migrate` | Dev migration (name `init`) |

