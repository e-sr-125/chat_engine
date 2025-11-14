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

## WebSocket Usage
Connect with Socket.IO client:
```javascript
import { io } from 'socket.io-client';
const socket = io('http://localhost:3000');
socket.on('connect', () => {
  socket.emit('send_message', { author_id: 'USER_ID', receiver_id: 'OTHER_ID', body: 'Hello!' });
});
socket.on('receive_message', (msg) => console.log('Received:', msg));
```
Payload stored: `{ id, author_id, receiver_id, body, created_at, ... }`.

## REST Endpoint Example
```http
GET /messages/USER_ID
```
Returns a list ordered by `created_at`.

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

## Prisma Commands
Host (DB exposed on localhost):
```powershell
npm run prisma:generate
$env:DATABASE_URL="postgresql://postgres:postgres@localhost:5432/chatdb?schema=public"; npm run prisma:migrate
```
Container:
```powershell
docker compose run --rm api npx prisma migrate dev --name init
```
Common error P1001 (cannot reach `db:5432`) occurs when you run from host while URL points to `db`.

## ngrok Tunnel (Optional)
```powershell
& "$env:APPDATA\npm\ngrok.cmd" config add-authtoken YOUR_TOKEN
& "$env:APPDATA\npm\ngrok.cmd" http http://localhost:3000
```
Forwarding URL appears in terminal.

## NPM Scripts
| Script | Purpose |
|--------|---------|
| `start:dev` | Run Nest in watch mode |
| `build` | Compile to `dist/` |
| `prisma:generate` | Generate Prisma client |
| `prisma:migrate` | Dev migration (name `init`) |

## Troubleshooting
| Issue | Cause | Fix |
|-------|-------|-----|
| P1001 (db unreachable) | Using `db:5432` from host | Use `localhost` or run inside container |
| OpenSSL warning / schema engine parse | Alpine image lacked OpenSSL | Switched to `node:18-bullseye-slim` + `openssl` |
| Missing HTTP driver error | `@nestjs/platform-express` absent | Added dependency |
| Bcrypt implicit `any` | Missing types | `npm i -D @types/bcrypt` |
| Decorators not valid | Method inside constructor | Move decorated methods to class body |
| `ngrok.ps1` not signed | PowerShell execution policy | Use `.cmd` shim or `Set-ExecutionPolicy Bypass` |

## Notes / Next Steps
- Add real auth & validation.
- Replace ad-hoc PrismaClient instances with a shared provider (to avoid many connections).
- Add healthchecks to Compose and conditional `depends_on` (service_healthy) if needed.

---
Minimal demo ready. Extend as needed.


