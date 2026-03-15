# S01: Unified async DB layer + app migration

**Goal:** Replace SQLite-only sync DB usage with a unified async interface that supports both SQLite and PostgreSQL via `DB_DRIVER` env variable.
**Demo:** `pnpm build` passes, `pnpm check-types` passes, `DB_DRIVER=sqlite pnpm dev` runs HonoJS + NestJS with working CRUD.

## Must-Haves

- `createDatabase(driver, url)` async factory in `packages/db`
- All app query code uses `await` instead of sync `.all()` / `.get()` / `.run()`
- `DB_DRIVER` env variable in both app env schemas (default: `sqlite`)
- SQLite bootstrap (CREATE TABLE) only runs when driver is sqlite
- PG path uses Drizzle migrations instead of inline DDL
- Zero regression on existing SQLite behavior

## Verification

- `pnpm build` — all packages and apps build successfully
- `pnpm check-types` — no type errors
- Start HonoJS with default config, curl CRUD endpoints

## Tasks

- [ ] **T01: Unified async DB factory in packages/db** `est:30m`
  - Why: Current `createDb` returns SQLite-specific sync instance. Need a factory that returns a consistent async-capable interface for both drivers.
  - Files: `packages/db/src/index.ts`, `packages/db/src/client.ts` (new), `packages/db/src/sqlite/client.ts`, `packages/db/src/pg/client.ts`
  - Do: Create `createDatabase(config: {driver, url})` that returns the appropriate Drizzle instance. Both SQLite and PG Drizzle already support async `.select().from().then()` — the key is to stop using `.all()` / `.get()` sync helpers and use the standard Drizzle query builder which returns Promises. Export unified types.
  - Verify: `cd packages/db && pnpm build` succeeds
  - Done when: `packages/db` exports `createDatabase` and types, builds clean

- [ ] **T02: Migrate HonoJS app to async DB** `est:30m`
  - Why: HonoJS routes use `.all()`, `.get()`, `.run()` sync methods. Must switch to async Drizzle queries.
  - Files: `apps/honojs/src/index.ts`, `apps/honojs/src/env.ts`, `apps/honojs/src/routes/users.ts`, `apps/honojs/src/routes/posts.ts`
  - Do: Add `DB_DRIVER` to env schema. Use `createDatabase` from `@repo/db`. Convert all route handlers to async. Replace `.all()` with `await db.select()...`, `.get()` with `await db.select()...limit(1)[0]` or `.then(rows => rows[0])`. Conditional SQLite bootstrap.
  - Verify: `cd apps/honojs && pnpm build` + start dev server + curl users/posts endpoints
  - Done when: HonoJS builds, starts, and CRUD works with SQLite

- [ ] **T03: Migrate NestJS app to async DB** `est:30m`
  - Why: Same sync-to-async migration needed for NestJS services.
  - Files: `apps/nestjs/src/main.ts`, `apps/nestjs/src/env.ts`, `apps/nestjs/src/database/database.module.ts`, `apps/nestjs/src/users/users.service.ts`, `apps/nestjs/src/posts/posts.service.ts`
  - Do: Add `DB_DRIVER` to env schema. Use `createDatabase` in DatabaseModule. Convert all service methods to async. Conditional SQLite bootstrap in main.ts.
  - Verify: `cd apps/nestjs && pnpm build` + start dev server + curl users/posts endpoints
  - Done when: NestJS builds, starts, and CRUD works with SQLite

- [ ] **T04: Full build + type check verification** `est:10m`
  - Why: Ensure nothing is broken across the monorepo after all changes.
  - Files: none (verification only)
  - Do: Run `pnpm build` and `pnpm check-types` from root.
  - Verify: Both commands exit 0
  - Done when: Clean build and type check across all workspace packages

## Files Likely Touched

- `packages/db/src/index.ts`
- `packages/db/src/client.ts`
- `packages/db/src/sqlite/client.ts`
- `packages/db/src/pg/client.ts`
- `packages/db/tsup.config.ts`
- `packages/db/package.json`
- `apps/honojs/src/index.ts`
- `apps/honojs/src/env.ts`
- `apps/honojs/src/routes/users.ts`
- `apps/honojs/src/routes/posts.ts`
- `apps/nestjs/src/main.ts`
- `apps/nestjs/src/env.ts`
- `apps/nestjs/src/database/database.module.ts`
- `apps/nestjs/src/users/users.service.ts`
- `apps/nestjs/src/posts/posts.service.ts`
