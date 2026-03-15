# S02: Docker Compose PostgreSQL + end-to-end verification

**Goal:** Docker Compose starts a PostgreSQL container, backends connect to it, CRUD works.
**Demo:** `docker compose up` → PG + HonoJS + NestJS start → curl CRUD endpoints return data.

## Must-Haves

- PostgreSQL service in docker-compose.yml with healthcheck
- Backend services use DB_DRIVER=pg + PostgreSQL DATABASE_URL
- docker-compose.prod.yml updated similarly
- Drizzle PG migrations run on startup or via script
- CRUD works end-to-end against PG

## Tasks

- [ ] **T01: Docker Compose PostgreSQL service + backend wiring** `est:20m`
- [ ] **T02: PG startup migration mechanism** `est:15m`
- [ ] **T03: End-to-end Docker verification** `est:15m`

## Files Likely Touched

- `docker-compose.yml`
- `docker-compose.prod.yml`
- `apps/honojs/src/index.ts`
- `apps/nestjs/src/main.ts`
- `packages/db/drizzle/pg/` (migration files)
