---
id: T01
parent: S02
milestone: M001
provides:
  - "@repo/env package with createEnv + z re-exports"
  - "@repo/shared package with UserSchema, ApiResponseSchema, and inferred types"
  - "pnpm catalog entries for zod, t3-env, tsup, drizzle-orm, better-sqlite3, drizzle-kit"
  - "tsup build pattern for shared packages (ESM + DTS)"
key_files:
  - pnpm-workspace.yaml
  - packages/env/src/index.ts
  - packages/shared/src/index.ts
  - packages/shared/src/schemas/user.ts
  - packages/shared/src/schemas/api-response.ts
key_decisions:
  - "No new decisions — followed D014 (tsup), D015 (Zod 4), D016 (shared independent of db) from research"
patterns_established:
  - "Shared package structure: package.json (type:module, exports field) + tsconfig.json (extends node.json) + tsup.config.ts (ESM+DTS) + eslint.config.mjs (imports @repo/eslint-config)"
  - "Zod 4 schema pattern: z.string().check(z.email()) for email validation, z.infer for type extraction"
observability_surfaces:
  - none
duration: 10m
verification_result: passed
completed_at: 2026-03-13
blocker_discovered: false
---

# T01: Create packages/env and packages/shared with catalog dependencies

**Added @repo/env and @repo/shared packages with tsup builds, updated pnpm catalog with 7 shared dependency versions.**

## What Happened

Updated `pnpm-workspace.yaml` catalog with zod (^4.0.0), @t3-oss/env-core (^0.13.10), tsup (^8.5.1), drizzle-orm (^0.45.1), better-sqlite3 (^12.6.2), drizzle-kit (^0.31.9), @types/better-sqlite3 (^7.6.13).

Created `packages/env` — thin wrapper re-exporting `createEnv` from @t3-oss/env-core and `z` from zod. Apps import both from a single `@repo/env` source.

Created `packages/shared` — Zod 4 schemas with inferred types. `UserSchema` (id, name, email, createdAt) and generic `ApiResponseSchema` factory (takes a data schema, returns success/data/error shape). Barrel-exported from `src/index.ts`.

Both packages follow identical structure: `package.json` with `"type": "module"` and exports field, `tsconfig.json` extending `@repo/typescript-config/node.json`, `tsup.config.ts` for ESM + DTS output, `eslint.config.mjs` importing `@repo/eslint-config`.

## Verification

- `pnpm install` — resolved cleanly, 43 packages added
- `pnpm build --filter @repo/env --filter @repo/shared` — both build in ~2s, 2/2 tasks successful
- `ls packages/env/dist/index.js packages/env/dist/index.d.ts` — ✅ both exist
- `ls packages/shared/dist/index.js packages/shared/dist/index.d.ts` — ✅ both exist
- `pnpm lint` — ✅ passes across all workspace packages (3/3)
- `pnpm check-types` — ✅ passes across all workspace packages (2/2)
- DTS output verified: env exports `createEnv` and `z`; shared exports `UserSchema`, `User`, `ApiResponseSchema`, `ApiResponse`

### Slice-level verification (partial — T01 is intermediate)

| Check | Status |
|-------|--------|
| `pnpm build --filter @repo/env --filter @repo/db --filter @repo/shared` | ❌ Expected — @repo/db not yet created (T02) |
| `pnpm lint` passes workspace | ✅ Pass |
| `pnpm check-types` passes workspace | ✅ Pass |
| `ls packages/env/dist/index.js packages/env/dist/index.d.ts` | ✅ Pass |
| `ls packages/db/dist/index.js packages/db/dist/index.d.ts` | ❌ Expected — T02 |
| `ls packages/shared/dist/index.js packages/shared/dist/index.d.ts` | ✅ Pass |

## Diagnostics

None — these are build-time packages with no runtime surfaces.

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `pnpm-workspace.yaml` — added 7 catalog entries (zod, @t3-oss/env-core, tsup, drizzle-orm, better-sqlite3, drizzle-kit, @types/better-sqlite3)
- `packages/env/package.json` — @repo/env package definition
- `packages/env/tsconfig.json` — extends @repo/typescript-config/node.json
- `packages/env/tsup.config.ts` — ESM + DTS build config
- `packages/env/eslint.config.mjs` — imports @repo/eslint-config
- `packages/env/src/index.ts` — re-exports createEnv and z
- `packages/shared/package.json` — @repo/shared package definition
- `packages/shared/tsconfig.json` — extends @repo/typescript-config/node.json
- `packages/shared/tsup.config.ts` — ESM + DTS build config
- `packages/shared/eslint.config.mjs` — imports @repo/eslint-config
- `packages/shared/src/index.ts` — barrel export
- `packages/shared/src/schemas/user.ts` — UserSchema + User type
- `packages/shared/src/schemas/api-response.ts` — ApiResponseSchema + ApiResponse type
