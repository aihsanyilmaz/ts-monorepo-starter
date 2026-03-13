---
estimated_steps: 5
estimated_files: 13
---

# T01: Create packages/env and packages/shared with catalog dependencies

**Slice:** S02 — Paylaşımlı Paketler (env, db, shared)
**Milestone:** M001

## Description

Add shared dependency versions to the pnpm catalog, then create two pure-TypeScript packages: `@repo/env` (wraps `@t3-oss/env-core` with zod re-export) and `@repo/shared` (example Zod schemas with inferred types). Both use tsup for ESM + DTS output, establishing the build pattern for all shared packages in the monorepo.

## Steps

1. **Update pnpm catalog** — Add `zod`, `@t3-oss/env-core`, `tsup`, `drizzle-orm`, `better-sqlite3`, `drizzle-kit`, `@types/better-sqlite3` to the `catalog:` section of `pnpm-workspace.yaml`. Pin to versions from research (zod ^4.0.0, tsup ^8.5.1, etc.).

2. **Create packages/env** — Set up `package.json` (`@repo/env`, `"type": "module"`, exports pointing to `dist/`), `tsconfig.json` (extends `@repo/typescript-config/node.json`), `tsup.config.ts` (ESM format, DTS generation), `eslint.config.mjs` (imports from `@repo/eslint-config`). Write `src/index.ts` that re-exports `createEnv` from `@t3-oss/env-core` and `z` from `zod`.

3. **Create packages/shared** — Same package structure as env. Write `src/schemas/user.ts` (UserSchema + inferred User type), `src/schemas/api-response.ts` (ApiResponseSchema + generic ApiResponse type), `src/index.ts` (barrel export). All schemas use Zod 4 API.

4. **Install and build** — Run `pnpm install` to resolve new catalog entries, then `pnpm build --filter @repo/env --filter @repo/shared`.

5. **Verify lint and type-check** — Run `pnpm lint` and `pnpm check-types` across the full workspace. Fix any issues.

## Must-Haves

- [ ] pnpm catalog has entries for zod, @t3-oss/env-core, tsup, drizzle-orm, better-sqlite3, drizzle-kit
- [ ] `@repo/env` exports `createEnv` and `z`
- [ ] `@repo/shared` exports `UserSchema`, `User`, `ApiResponseSchema`, `ApiResponse`
- [ ] Both packages use `"type": "module"` with exports field in package.json
- [ ] tsup builds produce `dist/index.js` and `dist/index.d.ts` for both packages
- [ ] `pnpm lint` and `pnpm check-types` pass across the workspace

## Verification

- `pnpm install` resolves without errors
- `pnpm build --filter @repo/env --filter @repo/shared` succeeds
- `ls packages/env/dist/index.js packages/env/dist/index.d.ts` — both exist
- `ls packages/shared/dist/index.js packages/shared/dist/index.d.ts` — both exist
- `pnpm lint` passes
- `pnpm check-types` passes

## Inputs

- `pnpm-workspace.yaml` — existing catalog section from S01 (has turbo, typescript, eslint, prettier entries)
- `packages/typescript-config/node.json` — tsconfig base for Node packages (NodeNext module/resolution)
- `packages/eslint-config/index.mjs` — shared ESLint flat config to import from
- S02 research — package architectures, version numbers, Zod 4 API notes

## Expected Output

- `pnpm-workspace.yaml` — updated catalog with new shared dependency versions
- `packages/env/` — complete package with src/index.ts, build config, dist/ output
- `packages/shared/` — complete package with schemas, types, barrel export, build config, dist/ output
