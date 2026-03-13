---
estimated_steps: 5
estimated_files: 15
---

# T01: Scaffold NestJS app with shared package integration and dummy endpoints

**Slice:** S04 — NestJS API App
**Milestone:** M001

## Description

Create the complete `apps/nestjs` application as a standalone Turborepo workspace member. The app uses NestJS with decorator-based DI, `@swc-node/register` for dev mode (since esbuild/tsx can't emit decorator metadata), and `tsc` for production builds. It mirrors the HonoJS app's endpoint surface (health, users, posts) and response shapes (`ApiResponse<T>` from `@repo/shared`), using the same shared packages (`@repo/env`, `@repo/db`, `@repo/shared`).

## Steps

1. **Create package.json and config files** — `package.json` with NestJS core deps (`@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express`, `reflect-metadata`, `rxjs`), shared workspace deps (`@repo/env`, `@repo/db`, `@repo/shared`), dev deps (`@swc-node/register`, `@swc/core`, `typescript`, `@repo/eslint-config`, `@repo/typescript-config`, `eslint`). Scripts: `dev` uses `node --watch --import @swc-node/register/esm src/main.ts`, `build` uses `tsc`, `lint` and `check-types` match HonoJS pattern. `tsconfig.json` extends `@repo/typescript-config/node.json` and adds `experimentalDecorators: true`, `emitDecoratorMetadata: true`. `eslint.config.mjs` re-exports `@repo/eslint-config`.

2. **Create entry point and env validation** — `src/env.ts` uses `createEnv` from `@repo/env` with PORT defaulting to 3002, NODE_ENV, DATABASE_URL. `src/main.ts` imports `reflect-metadata` first, then bootstraps NestJS app, runs idempotent table creation (D022), and listens on `env.PORT`.

3. **Create database module** — `src/database/database.module.ts` as a global NestJS module that provides the Drizzle db instance (created via `createDb` from `@repo/db`) as an injectable token. This keeps db access consistent with NestJS DI patterns.

4. **Create health, users, and posts modules** — Each with module, controller, and service (users/posts). Health is controller-only. Controllers return `ApiResponse<T>` shapes matching HonoJS. Users controller: GET /, GET /:id, POST /, PUT /:id, DELETE /:id. Posts controller: GET /, GET /:id, POST /, DELETE /:id. Services encapsulate Drizzle queries using the injected db instance.

5. **Install dependencies, verify build pipeline, and test endpoints** — Run `pnpm install`, then `pnpm build --filter nestjs`, `pnpm lint --filter nestjs`, `pnpm check-types --filter nestjs`. Start dev server and curl health/users/posts endpoints to verify correct responses.

## Must-Haves

- [ ] `reflect-metadata` is the first import in `main.ts`
- [ ] `experimentalDecorators` and `emitDecoratorMetadata` enabled in tsconfig
- [ ] Dev script uses `@swc-node/register/esm` (not tsx)
- [ ] Build script uses `tsc` (not tsup)
- [ ] Env validation with PORT=3002 default via `@repo/env`
- [ ] Idempotent table bootstrap at startup (CREATE TABLE IF NOT EXISTS)
- [ ] All three endpoints (health, users, posts) return `ApiResponse<T>` shapes
- [ ] Users CRUD: GET list, GET by id, POST create, PUT update, DELETE
- [ ] Posts CRUD: GET list, GET by id, POST create, DELETE
- [ ] `pnpm build --filter nestjs` succeeds
- [ ] `pnpm lint --filter nestjs` succeeds
- [ ] `pnpm check-types --filter nestjs` succeeds

## Verification

- `pnpm build --filter nestjs` exits 0
- `pnpm lint --filter nestjs` exits 0
- `pnpm check-types --filter nestjs` exits 0
- `curl http://localhost:3002/api/health` returns `{"success":true,"data":{"timestamp":"...","uptime":...}}`
- `curl http://localhost:3002/api/users` returns `{"success":true,"data":[]}`
- `curl http://localhost:3002/api/posts` returns `{"success":true,"data":[]}`

## Inputs

- `apps/honojs/` — reference implementation for endpoint shapes, env pattern, table bootstrap
- `packages/env/` — `createEnv` factory and `z` re-export
- `packages/db/` — `createDb`, `users`, `posts` schema exports
- `packages/shared/` — `ApiResponse`, `User` type exports
- `packages/typescript-config/node.json` — base tsconfig to extend
- S04-RESEARCH.md — toolchain decisions (`@swc-node/register`, `tsc` build, port 3002, ESM constraints)

## Expected Output

- `apps/nestjs/` — complete NestJS app directory with all source files, config, and working build
- Dev server starts on port 3002 and responds to health/users/posts endpoints
- All Turborepo pipeline tasks (build, lint, check-types) pass for the nestjs workspace
