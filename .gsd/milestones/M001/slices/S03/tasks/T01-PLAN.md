---
estimated_steps: 7
estimated_files: 10
---

# T01: Build Hono API app with dummy CRUD endpoints

**Slice:** S03 — HonoJS API App + API Client
**Milestone:** M001

## Description

Create the `apps/honojs` workspace — a Hono API server running on `@hono/node-server` with health, users, and posts CRUD endpoints. The app uses `@repo/env` for Zod-validated env config, `@repo/db` for Drizzle database queries, and `@repo/shared` for response envelope types. Routes are defined with method chaining so the resulting `AppType` carries full type inference for the RPC client in T02.

## Steps

1. **Add new dependencies to pnpm catalog** — Add `hono`, `@hono/node-server`, `@hono/zod-validator`, and `tsx` to the `catalog:` section of `pnpm-workspace.yaml`. Use latest stable versions.

2. **Create `apps/honojs/package.json`** — Follow the pattern from `@repo/shared`. Name: `@repo/honojs`. Dependencies: `hono`, `@hono/node-server`, `@hono/zod-validator`, `@repo/env`, `@repo/db`, `@repo/shared` (workspace:*). DevDependencies: `tsx`, `tsup`, `typescript`, `@repo/eslint-config`, `@repo/typescript-config`. Scripts: `dev: tsx watch src/index.ts`, `build: tsup`, `lint: eslint .`, `check-types: tsc --noEmit`.

3. **Create `apps/honojs/tsconfig.json`** — Extend `@repo/typescript-config/node.json`. Set `include: ["src"]`, `outDir: "dist"`.

4. **Create `apps/honojs/tsup.config.ts`** — Entry `src/index.ts`, ESM format, clean, external: `better-sqlite3` (transitive native dep via @repo/db). No DTS needed for the app itself (api-client imports the source type).

5. **Create `apps/honojs/src/env.ts`** — Use `createEnv` from `@repo/env`. Define server schema: `PORT` (z.coerce.number().default(3001)), `NODE_ENV` (z.enum default "development"), `DATABASE_URL` (z.string().default("./data/dev.db")). Export the resulting `env` object.

6. **Create route files with chained methods** — Three files:
   - `src/routes/health.ts`: GET `/` returns `{ success: true, timestamp, uptime: process.uptime() }`
   - `src/routes/users.ts`: GET `/` (list all), GET `/:id` (get one), POST `/` (create with zValidator), PUT `/:id` (update with zValidator), DELETE `/:id`. Use `@repo/db` for queries, `@repo/shared` `ApiResponse` envelope. Coerce integer IDs to strings for `UserSchema` compat.
   - `src/routes/posts.ts`: GET `/` (list all), GET `/:id`, POST `/` (create with zValidator), DELETE `/:id`. Same patterns.
   - Each route file exports `new Hono().method(...)` as a single chained expression — critical for type inference.

7. **Create `apps/honojs/src/index.ts`** — Import env (triggers validation at startup). Create db with `createDb(env.DATABASE_URL)`. Create main Hono app, add logger middleware, chain `.route('/health', healthRoutes).route('/users', usersRoutes).route('/posts', postsRoutes)` under a `/api` base path. Export `AppType = typeof routes`. Start server with `@hono/node-server` `serve()` on `env.PORT`. Log startup message.

8. **Run `pnpm install`, build, and verify** — `pnpm install` to resolve new deps. `pnpm build --filter @repo/honojs` must succeed. Start dev server, curl health/users/posts endpoints. Verify `pnpm lint --filter @repo/honojs` and `pnpm check-types --filter @repo/honojs` pass.

## Must-Haves

- [ ] Hono app starts on configurable port (default 3001)
- [ ] Health endpoint returns JSON with success/timestamp/uptime
- [ ] Users CRUD endpoints work with SQLite via `@repo/db`
- [ ] Posts CRUD endpoints work with SQLite via `@repo/db`
- [ ] Request validation uses `@hono/zod-validator` with Zod 4 schemas
- [ ] Env validated at startup via `@repo/env` — missing required vars fail fast
- [ ] `AppType` exported as `typeof routes` from chained route composition
- [ ] All responses use `ApiResponse` envelope from `@repo/shared`
- [ ] `pnpm build`, `pnpm lint`, `pnpm check-types` pass for `@repo/honojs`
- [ ] New deps added to pnpm catalog (not pinned locally)

## Verification

- `pnpm build --filter @repo/honojs` exits 0
- `pnpm lint --filter @repo/honojs` exits 0
- `pnpm check-types --filter @repo/honojs` exits 0
- Dev server starts: `pnpm dev --filter @repo/honojs`
- `curl http://localhost:3001/api/health` returns `{"success":true,...}`
- `curl http://localhost:3001/api/users` returns `{"success":true,"data":[]}`
- POST user, GET user by ID, DELETE user all return expected responses

## Inputs

- `packages/env/src/index.ts` — `createEnv` and `z` exports
- `packages/db/src/client.ts` — `createDb(url)` factory
- `packages/db/src/schema.ts` — `users`, `posts` table definitions
- `packages/shared/src/schemas/user.ts` — `UserSchema` (id is z.string(), DB is integer — must coerce)
- `packages/shared/src/schemas/api-response.ts` — `ApiResponse<T>` type for response envelope
- `packages/typescript-config/node.json` — tsconfig base for Node.js packages
- `pnpm-workspace.yaml` — catalog section for version management

## Expected Output

- `apps/honojs/` — fully functional Hono API app with 5+ endpoints
- `apps/honojs/src/index.ts` — exports `AppType` for api-client consumption
- `pnpm-workspace.yaml` — updated catalog with hono, @hono/node-server, @hono/zod-validator, tsx
- Running API server responding to HTTP requests on port 3001
