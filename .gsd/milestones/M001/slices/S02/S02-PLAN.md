# S02: Paylaşımlı Paketler (env, db, shared)

**Goal:** Three shared packages (`@repo/env`, `@repo/db`, `@repo/shared`) built via tsup, exporting ESM + DTS, consumable by all downstream app slices.
**Demo:** `pnpm build --filter @repo/env --filter @repo/db --filter @repo/shared` succeeds; built output in `dist/` contains `.js` and `.d.ts` files; `pnpm lint` and `pnpm check-types` pass across the workspace.

## Must-Haves

- `packages/env` re-exports `createEnv` from `@t3-oss/env-core` and `z` from `zod`
- `packages/db` exports Drizzle schema (users, posts tables) and `createDb` factory using better-sqlite3
- `packages/shared` exports example Zod schemas (`UserSchema`, `ApiResponseSchema`) with inferred types
- All three packages build via tsup to ESM + DTS in `dist/`
- pnpm catalog updated with zod, drizzle-orm, better-sqlite3, drizzle-kit, tsup, @t3-oss/env-core
- Each package has `tsconfig.json`, `eslint.config.mjs`, `tsup.config.ts`
- `pnpm build`, `pnpm lint`, `pnpm check-types` pass clean across the workspace

## Proof Level

- This slice proves: contract (packages build and export correct types)
- Real runtime required: no (build-time verification; runtime consumption happens in S03–S06)
- Human/UAT required: no

## Verification

- `pnpm build --filter @repo/env --filter @repo/db --filter @repo/shared` — all three build without errors
- `pnpm lint` — passes across the full workspace including new packages
- `pnpm check-types` — passes across the full workspace including new packages
- `ls packages/env/dist/index.js packages/env/dist/index.d.ts` — build artifacts exist
- `ls packages/db/dist/index.js packages/db/dist/index.d.ts` — build artifacts exist
- `ls packages/shared/dist/index.js packages/shared/dist/index.d.ts` — build artifacts exist

## Integration Closure

- Upstream surfaces consumed: `packages/typescript-config/node.json` (tsconfig base), `packages/eslint-config/index.mjs` (lint rules), `pnpm-workspace.yaml` catalog protocol
- New wiring introduced in this slice: three new workspace packages registered in pnpm workspace via `packages/*` glob (already configured in S01)
- What remains before the milestone is truly usable end-to-end: apps (S03–S06) that import these packages, per-app env.ts files, documentation (S07)

## Tasks

- [x] **T01: Create packages/env and packages/shared with catalog dependencies** `est:45m`
  - Why: These two packages are pure TypeScript/Zod with no native dependencies — low risk, establishes the tsup build pattern for the slice. Catalog must be updated first so all packages can reference shared versions.
  - Files: `pnpm-workspace.yaml`, `packages/env/package.json`, `packages/env/src/index.ts`, `packages/env/tsconfig.json`, `packages/env/tsup.config.ts`, `packages/env/eslint.config.mjs`, `packages/shared/package.json`, `packages/shared/src/index.ts`, `packages/shared/src/schemas/user.ts`, `packages/shared/src/schemas/api-response.ts`, `packages/shared/tsconfig.json`, `packages/shared/tsup.config.ts`, `packages/shared/eslint.config.mjs`
  - Do: Add zod, @t3-oss/env-core, tsup, drizzle-orm, better-sqlite3, drizzle-kit to pnpm catalog. Create packages/env with createEnv + z re-exports. Create packages/shared with UserSchema, ApiResponseSchema, and inferred types. Both packages use tsup for ESM + DTS build. Use `"type": "module"` and package.json exports field pointing to dist/.
  - Verify: `pnpm install && pnpm build --filter @repo/env --filter @repo/shared` succeeds; `pnpm lint && pnpm check-types` passes; dist/ contains .js and .d.ts for both packages
  - Done when: Both packages build clean, lint passes, type-check passes, dist output contains expected files

- [x] **T02: Create packages/db with Drizzle schema and verify all three packages** `est:45m`
  - Why: The db package has a native dependency (better-sqlite3) which is the main risk in this slice. Separated so native compilation issues are isolated. Also runs final slice-level verification across all three packages.
  - Files: `packages/db/package.json`, `packages/db/src/index.ts`, `packages/db/src/schema.ts`, `packages/db/src/client.ts`, `packages/db/drizzle.config.ts`, `packages/db/tsconfig.json`, `packages/db/tsup.config.ts`, `packages/db/eslint.config.mjs`
  - Do: Create packages/db with Drizzle SQLite schema (users, posts tables), createDb factory using better-sqlite3, drizzle-kit config. tsup build with better-sqlite3 marked as external (native module). Run full workspace verification.
  - Verify: `pnpm build --filter @repo/db` succeeds; `pnpm build && pnpm lint && pnpm check-types` all pass across full workspace; all three packages have dist/index.js and dist/index.d.ts
  - Done when: All three shared packages build, lint, and type-check clean; dist/ output verified for each

## Files Likely Touched

- `pnpm-workspace.yaml`
- `packages/env/package.json`, `packages/env/src/index.ts`, `packages/env/tsconfig.json`, `packages/env/tsup.config.ts`, `packages/env/eslint.config.mjs`
- `packages/shared/package.json`, `packages/shared/src/index.ts`, `packages/shared/src/schemas/user.ts`, `packages/shared/src/schemas/api-response.ts`, `packages/shared/tsconfig.json`, `packages/shared/tsup.config.ts`, `packages/shared/eslint.config.mjs`
- `packages/db/package.json`, `packages/db/src/index.ts`, `packages/db/src/schema.ts`, `packages/db/src/client.ts`, `packages/db/drizzle.config.ts`, `packages/db/tsconfig.json`, `packages/db/tsup.config.ts`, `packages/db/eslint.config.mjs`
