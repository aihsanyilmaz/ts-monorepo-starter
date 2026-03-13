# S03: HonoJS API App + API Client

**Goal:** `apps/honojs` serves a running Hono API with dummy CRUD endpoints using shared packages, and `packages/api-client` exports a typed RPC client that compiles across package boundaries.
**Demo:** `pnpm dev --filter @repo/honojs` starts the API, `curl localhost:3001/api/health` returns JSON, and `pnpm build --filter @repo/api-client` produces typed client output that references the app's `AppType`.

## Must-Haves

- Hono app with `@hono/node-server`, health + users + posts CRUD endpoints
- Zod-validated request bodies via `@hono/zod-validator`
- App-specific env config using `@repo/env` (`PORT`, `NODE_ENV`, `DATABASE_URL`)
- DB integration using `@repo/db` (`createDb`, schema queries)
- Shared types from `@repo/shared` used in response envelopes
- `AppType` exported from the app for RPC type inference
- `packages/api-client` exports `createApiClient(baseUrl)` typed with `AppType`
- `hono`, `@hono/node-server`, `@hono/zod-validator`, `tsx` added to pnpm catalog
- `pnpm build` succeeds for both `@repo/honojs` and `@repo/api-client`
- `pnpm lint` and `pnpm check-types` pass for both workspaces

## Proof Level

- This slice proves: integration (Hono RPC types crossing package boundaries)
- Real runtime required: yes (HTTP server must respond)
- Human/UAT required: no

## Verification

- `pnpm build --filter @repo/honojs --filter @repo/api-client` — both build clean
- `pnpm lint --filter @repo/honojs --filter @repo/api-client` — no lint errors
- `pnpm check-types --filter @repo/honojs --filter @repo/api-client` — no type errors
- Start dev server, `curl http://localhost:3001/api/health` returns `{"success":true,...}`
- `curl http://localhost:3001/api/users` returns `{"success":true,"data":[]}`
- `curl -X POST http://localhost:3001/api/users -H 'Content-Type: application/json' -d '{"name":"test","email":"test@example.com"}'` returns created user
- api-client's `dist/index.d.ts` contains typed references to the app's route structure (not `any`)

## Observability / Diagnostics

- Runtime signals: Startup log with port number and bound address; request logging via Hono's built-in logger middleware
- Inspection surfaces: `/api/health` endpoint returning `{ success: true, timestamp, uptime }`
- Failure visibility: Env validation fails at startup with clear Zod error messages; unhandled route errors return structured `ApiResponse` with error code/message

## Integration Closure

- Upstream surfaces consumed: `@repo/env` (createEnv, z), `@repo/db` (createDb, users, posts), `@repo/shared` (ApiResponse type, UserSchema)
- New wiring introduced: `apps/honojs` → running API server; `packages/api-client` → typed `hc` client factory; `api-client` has type-only workspace dependency on `apps/honojs`
- What remains: S05 (Next.js) and S06 (Expo) will consume `@repo/api-client` to complete the frontend→backend type chain

## Tasks

- [x] **T01: Build Hono API app with dummy CRUD endpoints** `est:1h`
  - Why: Delivers the core API server (R007), env validation (R004, R012), DB integration (R005), shared types usage (R006), and dev server (R014 partial). Also exports `AppType` needed by T02.
  - Files: `apps/honojs/package.json`, `apps/honojs/tsconfig.json`, `apps/honojs/tsup.config.ts`, `apps/honojs/src/index.ts`, `apps/honojs/src/env.ts`, `apps/honojs/src/routes/health.ts`, `apps/honojs/src/routes/users.ts`, `apps/honojs/src/routes/posts.ts`, `pnpm-workspace.yaml` (catalog additions)
  - Do: Add `hono`, `@hono/node-server`, `@hono/zod-validator`, `tsx` to pnpm catalog. Create Hono app with chained routes (critical for AppType inference). Use `@hono/zod-validator` for POST/PUT validation. Create `env.ts` with `createEnv` for PORT/NODE_ENV/DATABASE_URL. Wire `createDb()` at startup. Use `ApiResponse` envelope for all responses. Handle the `UserSchema.id` string vs DB integer mismatch by coercing in responses. Export `AppType = typeof routes` from index. Dev script: `tsx watch src/index.ts`. Build script: `tsup`.
  - Verify: `pnpm install && pnpm build --filter @repo/honojs` succeeds; start dev server and `curl localhost:3001/api/health` returns JSON; `pnpm check-types --filter @repo/honojs` passes
  - Done when: Hono API starts, all dummy endpoints respond with correct JSON, build and type-check pass

- [x] **T02: Build api-client package and verify cross-boundary RPC types** `est:30m`
  - Why: Delivers the typed API client (R011), retires the key risk (Hono RPC type chain across package boundaries), and ensures the full build pipeline resolves correctly with the package→app dependency direction.
  - Files: `packages/api-client/package.json`, `packages/api-client/tsconfig.json`, `packages/api-client/tsup.config.ts`, `packages/api-client/src/index.ts`
  - Do: Create `@repo/api-client` with workspace dependency on `@repo/honojs` (type-only import of `AppType`). Export `createApiClient(baseUrl: string)` using `hc<AppType>`. Mark `hono` as external in tsup config. Add `hono` as both dependency (for `hc` runtime) and ensure `@repo/honojs` is in dependencies for the type import. Verify `pnpm build` resolves correct ordering via turbo `^build`. Inspect `dist/index.d.ts` to confirm types are real (not `any`).
  - Verify: `pnpm build --filter @repo/api-client` succeeds; `pnpm check-types --filter @repo/api-client` passes; `grep` the generated `.d.ts` to confirm route types are present; `pnpm lint --filter @repo/api-client` passes; full `pnpm build` from root succeeds
  - Done when: api-client builds with real typed output, full monorepo build/lint/check-types pass for both new workspaces

## Files Likely Touched

- `pnpm-workspace.yaml` (catalog additions)
- `apps/honojs/package.json`
- `apps/honojs/tsconfig.json`
- `apps/honojs/tsup.config.ts`
- `apps/honojs/src/index.ts`
- `apps/honojs/src/env.ts`
- `apps/honojs/src/routes/health.ts`
- `apps/honojs/src/routes/users.ts`
- `apps/honojs/src/routes/posts.ts`
- `packages/api-client/package.json`
- `packages/api-client/tsconfig.json`
- `packages/api-client/tsup.config.ts`
- `packages/api-client/src/index.ts`
