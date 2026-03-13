---
id: T01
parent: S03
milestone: M001
provides:
  - apps/honojs — Hono API server with health, users, posts CRUD endpoints
  - AppType export for RPC client type inference
  - pnpm catalog entries for hono, @hono/node-server, @hono/zod-validator, tsx
key_files:
  - apps/honojs/src/index.ts
  - apps/honojs/src/env.ts
  - apps/honojs/src/routes/health.ts
  - apps/honojs/src/routes/users.ts
  - apps/honojs/src/routes/posts.ts
  - apps/honojs/package.json
  - apps/honojs/tsup.config.ts
  - pnpm-workspace.yaml
key_decisions:
  - Added drizzle-orm as direct dependency of @repo/honojs since route files import `eq` directly
  - Used skipNodeModulesBundle in tsup instead of listing individual externals — cleaner for app binaries
  - Idempotent CREATE TABLE IF NOT EXISTS at app startup since no migration system exists yet
  - Exported `routes` (not just `AppType`) so ESLint doesn't flag unused variable; also used `routes.fetch` in serve()
patterns_established:
  - Hono route files export a single chained `new Hono().method(...)` expression for full type inference
  - DB injected via Hono middleware `c.set('db', db)` with typed `Env` generic
  - Integer IDs from SQLite coerced to strings in response serialization to match shared schemas
  - Validation error hook on zValidator returns structured ApiResponse error before handler runs
observability_surfaces:
  - /api/health endpoint returns { success, data: { timestamp, uptime } }
  - Hono logger middleware logs all requests to stdout
  - Env validation fails at startup with clear Zod error if required vars missing
  - All error responses use structured ApiResponse envelope with code and message
duration: 25m
verification_result: passed
completed_at: 2026-03-13
blocker_discovered: false
---

# T01: Build Hono API app with dummy CRUD endpoints

**Fully functional Hono API server at `apps/honojs` with health, users CRUD, and posts CRUD endpoints backed by SQLite via `@repo/db`.**

## What Happened

Created the `apps/honojs` workspace with Hono running on `@hono/node-server`. Added `hono`, `@hono/node-server`, `@hono/zod-validator`, and `tsx` to the pnpm catalog. Built three route files — health, users, posts — each using method chaining on a single `new Hono()` instance so the resulting `AppType` carries full route type information for the RPC client.

The app uses `@repo/env` for Zod-validated config (PORT, NODE_ENV, DATABASE_URL), `@repo/db` for Drizzle queries against SQLite, and `@repo/shared`'s `ApiResponse` envelope for all responses. Request validation uses `@hono/zod-validator` with Zod 4 schemas. Integer IDs from the DB are coerced to strings to match `UserSchema` expectations.

Added idempotent `CREATE TABLE IF NOT EXISTS` statements at startup since no migration system exists yet — the app bootstraps its own tables.

## Verification

- `pnpm build --filter @repo/honojs` — ✅ 4/4 tasks successful
- `pnpm lint --filter @repo/honojs` — ✅ 4/4 tasks successful
- `pnpm check-types --filter @repo/honojs` — ✅ 4/4 tasks successful
- Dev server starts on port 3001 — ✅
- `curl /api/health` — ✅ `{"success":true,"data":{"timestamp":"...","uptime":...}}`
- `curl /api/users` — ✅ `{"success":true,"data":[]}`
- POST user — ✅ returns created user with id "1"
- GET user by ID — ✅ returns single user
- PUT user — ✅ updates and returns user
- DELETE user — ✅ returns deleted user, subsequent GET returns 404
- POST post with authorId — ✅ creates post
- GET/DELETE posts — ✅ work correctly
- Validation errors — ✅ missing fields and invalid email return structured error responses
- `dist/index.d.ts` — ✅ contains fully typed route schemas (no `any`)

### Slice-level checks (T01 scope):
- `pnpm build --filter @repo/honojs` — ✅ PASS
- `pnpm lint --filter @repo/honojs` — ✅ PASS
- `pnpm check-types --filter @repo/honojs` — ✅ PASS
- Health endpoint — ✅ PASS
- Users list — ✅ PASS
- Users create — ✅ PASS
- api-client checks — ⏳ pending T02

## Diagnostics

- Start dev server: `pnpm dev --filter @repo/honojs`
- Health check: `curl http://localhost:3001/api/health`
- Request logs appear in stdout via Hono's logger middleware
- Validation failures return `{"success":false,"error":{"code":"VALIDATION_ERROR","message":"..."}}`
- 404s return `{"success":false,"error":{"code":"NOT_FOUND","message":"..."}}`

## Deviations

- Added `drizzle-orm` as direct dependency (not in original plan) — needed for `eq` operator import in route files
- Added `eslint.config.mjs` (not mentioned in plan) — required for ESLint flat config
- Added `eslint` to devDependencies (following existing package pattern)
- Exported `routes` value (not just type) to satisfy ESLint no-unused-vars rule
- Added idempotent table bootstrap at startup (not in plan) — no migration system exists

## Known Issues

None.

## Files Created/Modified

- `pnpm-workspace.yaml` — added hono, @hono/node-server, @hono/zod-validator, tsx to catalog
- `apps/honojs/package.json` — new workspace package definition
- `apps/honojs/tsconfig.json` — extends @repo/typescript-config/node.json
- `apps/honojs/tsup.config.ts` — ESM build with skipNodeModulesBundle
- `apps/honojs/eslint.config.mjs` — flat config using @repo/eslint-config
- `apps/honojs/src/env.ts` — Zod-validated env config via createEnv
- `apps/honojs/src/index.ts` — main app with route composition, AppType export, DB bootstrap
- `apps/honojs/src/routes/health.ts` — health check endpoint
- `apps/honojs/src/routes/users.ts` — users CRUD with validation
- `apps/honojs/src/routes/posts.ts` — posts CRUD with validation
