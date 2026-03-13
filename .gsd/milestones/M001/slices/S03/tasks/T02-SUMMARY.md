---
id: T02
parent: S03
milestone: M001
provides:
  - packages/api-client — typed Hono RPC client package with createApiClient() factory and AppType re-export
key_files:
  - packages/api-client/package.json
  - packages/api-client/src/index.ts
  - packages/api-client/tsup.config.ts
  - packages/api-client/tsconfig.json
  - packages/api-client/eslint.config.mjs
key_decisions:
  - hono marked as external in tsup — consumers get it as transitive dep, not bundled into the client package
  - "@repo/honojs" listed as runtime dependency (not devDependency) so the type-only import resolves through the workspace link at build time
patterns_established:
  - Thin wrapper pattern for Hono RPC client — single createApiClient(baseUrl) factory re-exporting hc<AppType>
  - Package→app dependency direction works in pnpm monorepo with turbo ^build resolving order correctly
observability_surfaces:
  - none — this is a pure type wrapper with no runtime state
duration: ~8min
verification_result: passed
completed_at: 2026-03-13
blocker_discovered: false
---

# T02: Build api-client package and verify cross-boundary RPC types

**Created `packages/api-client` with typed `createApiClient()` factory — Hono RPC types fully preserved across package boundaries.**

## What Happened

Built `packages/api-client` as a thin wrapper around Hono's `hc` client, importing `AppType` from `@repo/honojs`. The package exports `createApiClient(baseUrl)` returning a fully typed RPC client and re-exports `AppType` for advanced consumers. `hono` is marked external in tsup to avoid bundling. The key risk — Hono RPC types surviving across package boundaries in a pnpm monorepo — is retired: the generated `dist/index.d.ts` (14.83 KB) contains real `ClientRequest` types for all routes (`health`, `users`, `posts`, `users/:id`, `posts/:id`).

## Verification

- `pnpm build --filter @repo/api-client` — exits 0, produces dist/index.js (140 B) + dist/index.d.ts (14.83 KB)
- `pnpm check-types --filter @repo/api-client` — exits 0
- `pnpm lint --filter @repo/api-client` — exits 0
- `grep 'health\|users\|posts' packages/api-client/dist/index.d.ts` — 7 matches, all real `ClientRequest<>` types
- `pnpm build` (root) — 5/5 tasks pass, turbo resolves honojs before api-client
- `pnpm lint` (root) — 10/10 tasks pass
- `pnpm check-types` (root) — 9/9 tasks pass

### Slice-level checks (all pass — this is the final task):
- `pnpm build --filter @repo/honojs --filter @repo/api-client` — both build clean
- `pnpm lint --filter @repo/honojs --filter @repo/api-client` — no lint errors
- `pnpm check-types --filter @repo/honojs --filter @repo/api-client` — no type errors
- `curl http://localhost:3001/api/health` — returns `{"success":true,"data":{"timestamp":"...","uptime":...}}`
- `curl http://localhost:3001/api/users` — returns `{"success":true,"data":[]}`
- `curl -X POST http://localhost:3001/api/users ...` — returns created user with id, name, email, createdAt
- api-client's `dist/index.d.ts` — contains typed `ClientRequest` references for health, users, posts routes

## Diagnostics

- Inspect generated types: `cat packages/api-client/dist/index.d.ts`
- Rebuild from scratch: `pnpm build --filter @repo/api-client`
- Verify route types present: `grep 'health\|users\|posts' packages/api-client/dist/index.d.ts`

## Deviations

Added `eslint.config.mjs` — not listed in the task plan but required by ESLint v9 flat config. Follows the same pattern as all other packages.

## Known Issues

None.

## Files Created/Modified

- `packages/api-client/package.json` — package manifest with hono and @repo/honojs dependencies
- `packages/api-client/tsconfig.json` — extends @repo/typescript-config/node.json
- `packages/api-client/tsup.config.ts` — ESM + DTS build, hono external
- `packages/api-client/src/index.ts` — createApiClient factory + AppType re-export
- `packages/api-client/eslint.config.mjs` — flat config re-exporting @repo/eslint-config
