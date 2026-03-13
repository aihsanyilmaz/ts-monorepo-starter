# S04: NestJS API App

**Goal:** `apps/nestjs` is a working NestJS API within the Turborepo workspace, using `@repo/env`, `@repo/db`, and `@repo/shared`, with the same dummy endpoints as HonoJS (health, users, posts).
**Demo:** `pnpm dev --filter nestjs` starts NestJS on port 3002; `curl localhost:3002/api/health` returns a JSON health response.

## Must-Haves

- NestJS app runs as a standalone Turborepo workspace member (no `@nestjs/cli`, no `nest-cli.json`)
- `@swc-node/register` for dev mode (decorator metadata support); `tsc` for production build
- `reflect-metadata` imported before any NestJS code in `main.ts`
- Env validation via `@repo/env` with PORT defaulting to 3002
- Idempotent table bootstrap at startup (same pattern as HonoJS — D022)
- Health, users, and posts endpoints returning `ApiResponse<T>` shapes from `@repo/shared`
- `pnpm build --filter nestjs`, `pnpm lint --filter nestjs`, `pnpm check-types --filter nestjs` all pass

## Verification

- `pnpm build --filter nestjs` — tsc compiles to `dist/` without errors
- `pnpm lint --filter nestjs` — ESLint passes
- `pnpm check-types --filter nestjs` — tsc --noEmit passes
- Start dev server, `curl http://localhost:3002/api/health` returns `{"success":true,"data":{...}}`
- `curl http://localhost:3002/api/users` returns `{"success":true,"data":[]}`

## Tasks

- [x] **T01: Scaffold NestJS app with shared package integration and dummy endpoints** `est:1h`
  - Why: This is the entire slice — create the NestJS app, wire shared packages, implement all endpoints, verify everything works
  - Files: `apps/nestjs/package.json`, `apps/nestjs/tsconfig.json`, `apps/nestjs/eslint.config.mjs`, `apps/nestjs/src/main.ts`, `apps/nestjs/src/env.ts`, `apps/nestjs/src/app.module.ts`, `apps/nestjs/src/health/`, `apps/nestjs/src/users/`, `apps/nestjs/src/posts/`
  - Do: Create package.json with NestJS deps + `@swc-node/register` + workspace refs. tsconfig extending node.json with `experimentalDecorators` + `emitDecoratorMetadata`. env.ts with PORT=3002. main.ts with reflect-metadata import, bootstrap, table creation. Health/Users/Posts modules with controllers and services using `@repo/db` and `@repo/shared` types. Same `ApiResponse<T>` response shapes as HonoJS. ESLint config re-exporting `@repo/eslint-config`.
  - Verify: `pnpm build --filter nestjs && pnpm lint --filter nestjs && pnpm check-types --filter nestjs` pass; dev server starts and `curl localhost:3002/api/health` returns valid JSON
  - Done when: All three pipeline commands pass clean and health/users/posts endpoints respond with correct `ApiResponse` shapes

## Files Likely Touched

- `apps/nestjs/package.json`
- `apps/nestjs/tsconfig.json`
- `apps/nestjs/eslint.config.mjs`
- `apps/nestjs/src/main.ts`
- `apps/nestjs/src/env.ts`
- `apps/nestjs/src/app.module.ts`
- `apps/nestjs/src/health/health.controller.ts`
- `apps/nestjs/src/health/health.module.ts`
- `apps/nestjs/src/users/users.controller.ts`
- `apps/nestjs/src/users/users.service.ts`
- `apps/nestjs/src/users/users.module.ts`
- `apps/nestjs/src/posts/posts.controller.ts`
- `apps/nestjs/src/posts/posts.service.ts`
- `apps/nestjs/src/posts/posts.module.ts`
- `apps/nestjs/src/database/database.module.ts`
