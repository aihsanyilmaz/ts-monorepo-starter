---
id: T01
parent: S04
milestone: M001
provides:
  - Complete NestJS app with health, users, posts endpoints
  - NestJS integrated with @repo/env, @repo/db, @repo/shared
  - Database module with DI-injectable Drizzle instance
key_files:
  - apps/nestjs/package.json
  - apps/nestjs/tsconfig.json
  - apps/nestjs/src/main.ts
  - apps/nestjs/src/app.module.ts
  - apps/nestjs/src/database/database.module.ts
  - apps/nestjs/src/users/users.controller.ts
  - apps/nestjs/src/posts/posts.controller.ts
key_decisions:
  - "D026: Use @swc-node/register/esm-register (not esm) for Node 24 compatibility"
  - "Added @nestjs/core and @swc/core to pnpm.onlyBuiltDependencies"
patterns_established:
  - NestJS modules follow controller + service + DTO pattern with DI-injected Drizzle db
  - Global DatabaseModule provides DB_TOKEN injectable across all modules
  - class-validator DTOs for request validation, @repo/shared ApiResponse for response shapes
observability_surfaces:
  - NestJS startup logs show module initialization and route mapping
  - Health endpoint at /api/health returns uptime and timestamp
duration: ~25min
verification_result: passed
completed_at: 2026-03-13
blocker_discovered: false
---

# T01: Scaffold NestJS app with shared package integration and dummy endpoints

**Built complete NestJS API app at `apps/nestjs/` with health, users, posts CRUD endpoints, Drizzle DB integration, and all Turborepo pipeline tasks passing.**

## What Happened

Created `apps/nestjs` as a standalone Turborepo workspace member with NestJS 11. The app uses decorator-based DI with `reflect-metadata`, `@swc-node/register/esm-register` for dev mode (SWC emits decorator metadata that esbuild/tsx cannot), and `tsc` for production builds.

Architecture follows NestJS module pattern:
- **DatabaseModule** — global module providing Drizzle db instance as injectable token (`DB_TOKEN`)
- **HealthModule** — controller-only, returns uptime/timestamp
- **UsersModule** — controller + service + DTOs, full CRUD (GET list, GET by id, POST, PUT, DELETE)
- **PostsModule** — controller + service + DTOs, CRUD (GET list, GET by id, POST, DELETE)

All endpoints return `ApiResponse<T>` shapes from `@repo/shared`, matching HonoJS response format. Services use injected Drizzle instance with real database queries via `@repo/db` schemas. Request validation uses `class-validator` + `class-transformer` DTOs with NestJS `ValidationPipe`.

Hit one issue: `@swc-node/register/esm` uses deprecated loader hooks that don't work on Node 24 — `.js` → `.ts` resolution wasn't intercepted. Switched to `@swc-node/register/esm-register` which uses the current `--import` registration API and works correctly.

Added `@nestjs/core` and `@swc/core` to `pnpm.onlyBuiltDependencies` in root `package.json` (both have postinstall scripts).

## Verification

All must-haves and slice verification checks pass:

- ✅ `pnpm build --filter @repo/nestjs` — tsc compiles to `dist/` clean
- ✅ `pnpm lint --filter @repo/nestjs` — ESLint passes
- ✅ `pnpm check-types --filter @repo/nestjs` — tsc --noEmit passes
- ✅ `curl http://localhost:3002/api/health` → `{"success":true,"data":{"timestamp":"...","uptime":...}}`
- ✅ `curl http://localhost:3002/api/users` → `{"success":true,"data":[]}`
- ✅ `curl http://localhost:3002/api/posts` → `{"success":true,"data":[]}`
- ✅ Full CRUD verified: create user → get user → update user → create post → get post → delete post → delete user → verify empty lists
- ✅ `reflect-metadata` is first import in `main.ts`
- ✅ `experimentalDecorators` and `emitDecoratorMetadata` enabled in tsconfig
- ✅ Dev uses `@swc-node/register/esm-register`, build uses `tsc`
- ✅ Env validation with PORT=3002 default
- ✅ Idempotent table bootstrap at startup

## Diagnostics

- NestJS startup logs show all modules initialized and routes mapped (visible in dev console)
- `GET /api/health` returns uptime for quick liveness check
- NestJS's built-in exception filter returns structured error responses for 400/404 cases

## Deviations

- Dev script uses `@swc-node/register/esm-register` instead of `@swc-node/register/esm` (D026) — the `esm` entry doesn't work on Node 24
- Turbo filter must use `@repo/nestjs` (full package name), not `nestjs` — consistent with how `@repo/honojs` works
- Added `mkdirSync` for data directory creation in `main.ts` so the app self-bootstraps without manual setup

## Known Issues

None.

## Files Created/Modified

- `apps/nestjs/package.json` — workspace package with NestJS deps, SWC dev tooling, shared package refs
- `apps/nestjs/tsconfig.json` — extends node.json with decorator metadata enabled
- `apps/nestjs/eslint.config.mjs` — re-exports @repo/eslint-config
- `apps/nestjs/.gitignore` — excludes data/ directory
- `apps/nestjs/src/env.ts` — env validation with PORT=3002 default
- `apps/nestjs/src/main.ts` — entry point with reflect-metadata, table bootstrap, NestJS bootstrap
- `apps/nestjs/src/app.module.ts` — root module importing all feature modules
- `apps/nestjs/src/database/database.module.ts` — global DI module providing Drizzle db instance
- `apps/nestjs/src/health/health.controller.ts` — health endpoint
- `apps/nestjs/src/health/health.module.ts` — health module
- `apps/nestjs/src/users/users.dto.ts` — CreateUser and UpdateUser validation DTOs
- `apps/nestjs/src/users/users.service.ts` — users CRUD service with Drizzle queries
- `apps/nestjs/src/users/users.controller.ts` — users REST controller
- `apps/nestjs/src/users/users.module.ts` — users module
- `apps/nestjs/src/posts/posts.dto.ts` — CreatePost validation DTO
- `apps/nestjs/src/posts/posts.service.ts` — posts CRUD service with Drizzle queries
- `apps/nestjs/src/posts/posts.controller.ts` — posts REST controller
- `apps/nestjs/src/posts/posts.module.ts` — posts module
- `package.json` — added @nestjs/core and @swc/core to onlyBuiltDependencies
- `.gsd/DECISIONS.md` — appended D026 (esm-register for Node 24)
