# M002: PostgreSQL Integration

**Vision:** Users can choose PostgreSQL or SQLite via a single env variable. Docker Compose includes a ready-to-use PG setup. Default remains SQLite for zero-config DX.

## Success Criteria

- `DB_DRIVER=sqlite pnpm dev` works exactly as before (zero regression)
- `DB_DRIVER=pg DATABASE_URL=postgresql://... pnpm dev` connects to PG and CRUD works
- `docker compose up` starts a PostgreSQL container and backends connect to it
- Drizzle migrations work for PG (`pnpm db:migrate:pg`)

## Key Risks / Unknowns

- Sync-to-async migration across all query code — risk of missed `.all()` / `.get()` calls causing runtime errors

## Proof Strategy

- Sync-to-async → retire in S01 by proving both drivers work with the same async interface

## Verification Classes

- Contract verification: `pnpm build` + `pnpm check-types` pass
- Integration verification: curl CRUD endpoints against both SQLite and PG backends
- Operational verification: `docker compose up` starts PG + backends, health checks pass

## Milestone Definition of Done

- All slices complete
- `pnpm build` and `pnpm check-types` pass
- CRUD works against both SQLite (local) and PG (Docker)
- README documents PG usage

## Requirement Coverage

- Covers: existing DB requirement (PostgreSQL ready → PostgreSQL working)
- Leaves for later: production PG hosting guidance

## Slices

- [x] **S01: Unified async DB layer + app migration** `risk:high` `depends:[]`
  > After this: `packages/db` exports async factory, both apps use async queries, `pnpm build` + `pnpm check-types` pass, SQLite CRUD still works
- [x] **S02: Docker Compose PostgreSQL + end-to-end verification** `risk:medium` `depends:[S01]`
  > After this: `docker compose up` starts PG container, backends connect, CRUD works via curl
- [x] **S03: Documentation & env examples** `risk:low` `depends:[S02]`
  > After this: README documents PG setup, `.env.example` files show PG config

## Boundary Map

### S01 → S02

Produces:
- `packages/db` async `createDatabase(driver, url)` factory
- `DB_DRIVER` env variable in both app env schemas
- All query code async-compatible

Consumes:
- nothing (first slice)

### S02 → S03

Produces:
- Working Docker Compose with PG service
- Verified CRUD against PG

Consumes:
- Async DB layer from S01
