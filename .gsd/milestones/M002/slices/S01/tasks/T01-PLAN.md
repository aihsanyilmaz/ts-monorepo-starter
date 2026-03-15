---
estimated_steps: 5
estimated_files: 5
---

# T01: Unified async DB factory in packages/db

**Slice:** S01 — Unified async DB layer + app migration
**Milestone:** M002

## Description

Create a `createDatabase(config)` factory that returns the appropriate Drizzle instance based on `driver` parameter. Both SQLite and PG Drizzle query builders implement `QueryPromise`, so `await db.select().from(table)` works for both. The factory handles driver selection; consumers just use async queries.

## Steps

1. Create `packages/db/src/client.ts` with `createDatabase({driver, url})` factory
2. Update `packages/db/src/index.ts` to export new factory + both schemas
3. Update `packages/db/tsup.config.ts` if needed for new entry point
4. Update `packages/db/package.json` exports if needed
5. Verify build passes

## Must-Haves

- [ ] `createDatabase({driver: 'sqlite' | 'pg', url: string})` factory
- [ ] Returns Drizzle instance usable with `await`
- [ ] Old `createDb` export kept for backward compat (deprecated)
- [ ] `pnpm build` passes for packages/db

## Verification

- `cd packages/db && pnpm build` succeeds
- Exported types resolve correctly

## Inputs

- `packages/db/src/sqlite/client.ts` — existing SQLite client
- `packages/db/src/pg/client.ts` — existing PG client

## Expected Output

- `packages/db/src/client.ts` — new unified factory
- `packages/db/src/index.ts` — updated exports
