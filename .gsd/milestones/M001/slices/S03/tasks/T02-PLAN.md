---
estimated_steps: 5
estimated_files: 4
---

# T02: Build api-client package and verify cross-boundary RPC types

**Slice:** S03 — HonoJS API App + API Client
**Milestone:** M001

## Description

Create `packages/api-client` — a thin package that imports `AppType` from `apps/honojs` and re-exports a typed `createApiClient(baseUrl)` factory using Hono's `hc` client. This retires the key risk of Hono RPC types working across package boundaries in a pnpm monorepo. The package must build with real types (not `any`) and the full monorepo build pipeline must resolve correctly despite the unusual package→app dependency direction.

## Steps

1. **Create `packages/api-client/package.json`** — Name: `@repo/api-client`. Dependencies: `hono` (catalog:, for the `hc` runtime), `@repo/honojs` (workspace:*, for `AppType` type import). DevDependencies: `tsup`, `typescript`, `@repo/eslint-config`, `@repo/typescript-config`. Exports: standard `dist/index.js` + `dist/index.d.ts` pattern. Scripts: build/dev/lint/check-types matching existing packages.

2. **Create `packages/api-client/tsconfig.json`** — Extend `@repo/typescript-config/node.json`. Include `src/`. Set outDir `dist/`.

3. **Create `packages/api-client/tsup.config.ts`** — Entry `src/index.ts`, ESM format, DTS: true (critical — consumers need the `.d.ts`), clean. External: `hono` (prevent bundling Hono into the client package — consumers get it as transitive dep).

4. **Create `packages/api-client/src/index.ts`** — Import `AppType` from `@repo/honojs` (type-only). Import `hc` from `hono/client`. Export `createApiClient(baseUrl: string)` that returns `hc<AppType>(baseUrl)`. Also re-export `AppType` for advanced consumers. Keep it minimal — this is a thin wrapper.

5. **Verify full pipeline** — Run `pnpm install`. Run `pnpm build` from root — turbo must resolve `@repo/honojs` before `@repo/api-client` via `^build`. Inspect `packages/api-client/dist/index.d.ts` — grep for route-related types to confirm they're real (not `any`). Run `pnpm lint --filter @repo/api-client` and `pnpm check-types --filter @repo/api-client`. Run full `pnpm build && pnpm lint && pnpm check-types` from root to confirm no regressions.

## Must-Haves

- [ ] `createApiClient(baseUrl)` exported and typed with `AppType`
- [ ] `AppType` re-exported for advanced use
- [ ] `hono` marked as external in tsup (not bundled)
- [ ] Generated `dist/index.d.ts` contains real route types (not `any`)
- [ ] Turbo resolves build order correctly (honojs before api-client)
- [ ] Full monorepo `pnpm build`, `pnpm lint`, `pnpm check-types` pass

## Verification

- `pnpm build --filter @repo/api-client` exits 0
- `pnpm check-types --filter @repo/api-client` exits 0
- `pnpm lint --filter @repo/api-client` exits 0
- `grep -q 'health\|users\|posts' packages/api-client/dist/index.d.ts` — route types present in output (not erased to `any`)
- `pnpm build` from root exits 0 (full pipeline)
- `pnpm check-types` from root exits 0

## Inputs

- `apps/honojs/src/index.ts` — T01's `AppType` export (the `typeof routes` capturing chained route types)
- `packages/shared/tsup.config.ts` — tsup config pattern to follow
- `packages/typescript-config/node.json` — tsconfig base
- `pnpm-workspace.yaml` — hono already in catalog from T01

## Expected Output

- `packages/api-client/` — complete package with `dist/` containing typed ESM + DTS
- `packages/api-client/dist/index.d.ts` — contains real Hono route type references
- Full monorepo build pipeline passes with correct dependency ordering
- Key risk (Hono RPC types across package boundaries) retired
