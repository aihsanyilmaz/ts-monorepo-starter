---
estimated_steps: 4
estimated_files: 8
---

# T02: Create packages/db with Drizzle schema and verify all three packages

**Slice:** S02 — Paylaşımlı Paketler (env, db, shared)
**Milestone:** M001

## Description

Create `@repo/db` with Drizzle ORM schema definitions (users, posts tables), a `createDb` factory using better-sqlite3, and drizzle-kit migration config. The native dependency (better-sqlite3) is the primary risk — it must compile and be marked external in tsup. After building, run full workspace verification across all three shared packages.

## Steps

1. **Create packages/db package structure** — Set up `package.json` (`@repo/db`, `"type": "module"`, deps on drizzle-orm and better-sqlite3, devDeps on drizzle-kit and @types/better-sqlite3), `tsconfig.json` (extends node.json), `tsup.config.ts` (ESM, DTS, mark `better-sqlite3` and `drizzle-orm` as external), `eslint.config.mjs`.

2. **Write schema and client** — Create `src/schema.ts` with Drizzle SQLite table definitions (users table with id/name/email/createdAt, posts table with id/title/content/authorId/createdAt). Create `src/client.ts` with `createDb(url?)` factory that instantiates better-sqlite3 and wraps with drizzle. Create `src/index.ts` barrel that re-exports schema, createDb, and table references.

3. **Add drizzle-kit config** — Create `drizzle.config.ts` at package root with `dialect: "sqlite"`, schema path, and output directory for migrations.

4. **Full workspace verification** — Run `pnpm install`, `pnpm build` (all packages), `pnpm lint`, `pnpm check-types`. Verify all three packages have dist/index.js and dist/index.d.ts.

## Must-Haves

- [ ] `@repo/db` exports `createDb`, `schema`, individual table references (`users`, `posts`)
- [ ] better-sqlite3 compiles successfully during `pnpm install`
- [ ] tsup marks better-sqlite3 as external (not bundled)
- [ ] drizzle.config.ts configured for SQLite dialect
- [ ] `pnpm build` passes for all three shared packages
- [ ] `pnpm lint` and `pnpm check-types` pass across full workspace

## Verification

- `pnpm build --filter @repo/db` succeeds
- `ls packages/db/dist/index.js packages/db/dist/index.d.ts` — both exist
- `pnpm build` — full workspace build passes
- `pnpm lint` — full workspace lint passes
- `pnpm check-types` — full workspace type-check passes

## Inputs

- `pnpm-workspace.yaml` — catalog with drizzle-orm, better-sqlite3, drizzle-kit entries (from T01)
- `packages/typescript-config/node.json` — tsconfig base
- `packages/eslint-config/index.mjs` — shared ESLint config
- T01 output — established tsup build pattern in env and shared packages

## Expected Output

- `packages/db/` — complete package with schema, client factory, drizzle-kit config, build output in dist/
- Full workspace passes build + lint + check-types
