---
id: T02
parent: S02
milestone: M001
provides:
  - "@repo/db package with createDb factory, users/posts Drizzle SQLite schema, drizzle-kit config"
key_files:
  - packages/db/src/schema.ts
  - packages/db/src/client.ts
  - packages/db/src/index.ts
  - packages/db/drizzle.config.ts
  - packages/db/tsup.config.ts
key_decisions:
  - "Approved better-sqlite3 build script via pnpm.onlyBuiltDependencies in root package.json — native addon requires postinstall compilation"
  - "WAL mode + foreign_keys pragma set in createDb factory — sensible SQLite defaults for concurrent reads and referential integrity"
  - "drizzle-orm also marked external in tsup alongside better-sqlite3 — avoids bundling the ORM since consumers will have it as a dependency"
patterns_established:
  - "Native dependency handling: add to pnpm.onlyBuiltDependencies in root package.json, mark as external in tsup"
  - "Drizzle schema pattern: sqliteTable with integer PK (autoIncrement), text columns, sql template for defaults"
  - "Client factory pattern: createDb(url?) returns configured drizzle instance with schema, defaults to :memory:"
observability_surfaces:
  - none — build-time package with no runtime surfaces
duration: ~5min
verification_result: passed
completed_at: 2026-03-13
blocker_discovered: false
---

# T02: Create packages/db with Drizzle schema and verify all three packages

**Added @repo/db with users/posts Drizzle SQLite schema, createDb factory, and drizzle-kit config; all three shared packages pass build/lint/check-types.**

## What Happened

Created packages/db following the established tsup pattern from T01. Schema defines users (id, name, email, createdAt) and posts (id, title, content, authorId FK, createdAt) tables using Drizzle's SQLite column builders. Client factory creates a better-sqlite3 instance with WAL mode and foreign keys enabled, wraps it with drizzle. Both better-sqlite3 and drizzle-orm are marked external in tsup config.

Had to approve better-sqlite3's native build script via `pnpm.onlyBuiltDependencies` in root package.json — pnpm v10 blocks postinstall scripts by default.

## Verification

- `pnpm install` — better-sqlite3 native addon compiled successfully
- `pnpm build --filter @repo/db` — ESM + DTS output in dist/
- `grep "better-sqlite3" packages/db/dist/index.js` — confirms external import, not bundled
- `pnpm build` — all 3 packages build (FULL TURBO)
- `pnpm lint` — 4 tasks pass (db, env, shared, eslint-config)
- `pnpm check-types` — 3 tasks pass (db, env, shared)
- `ls packages/{env,db,shared}/dist/index.{js,d.ts}` — all 6 artifacts exist

### Slice-level verification status (all pass — this is the final task):
- [x] `pnpm build --filter @repo/env --filter @repo/db --filter @repo/shared` — all three build
- [x] `pnpm lint` — passes across full workspace
- [x] `pnpm check-types` — passes across full workspace
- [x] `ls packages/env/dist/index.js packages/env/dist/index.d.ts` — exist
- [x] `ls packages/db/dist/index.js packages/db/dist/index.d.ts` — exist
- [x] `ls packages/shared/dist/index.js packages/shared/dist/index.d.ts` — exist

## Diagnostics

None — build-time package. To inspect schema: `cat packages/db/src/schema.ts`. To generate migrations: `cd packages/db && pnpm db:generate`.

## Deviations

Added `pnpm.onlyBuiltDependencies` to root package.json — not in the task plan but required for pnpm v10 to allow better-sqlite3's native compilation.

## Known Issues

None.

## Files Created/Modified

- `packages/db/package.json` — package config with drizzle-orm, better-sqlite3 deps and db:* scripts
- `packages/db/tsconfig.json` — extends node.json base
- `packages/db/tsup.config.ts` — ESM + DTS, better-sqlite3 and drizzle-orm external
- `packages/db/eslint.config.mjs` — shared ESLint config
- `packages/db/src/schema.ts` — users and posts table definitions
- `packages/db/src/client.ts` — createDb factory with WAL mode and foreign keys
- `packages/db/src/index.ts` — barrel re-exports
- `packages/db/drizzle.config.ts` — drizzle-kit config for SQLite
- `package.json` — added pnpm.onlyBuiltDependencies for better-sqlite3
