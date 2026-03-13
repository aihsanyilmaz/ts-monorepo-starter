---
id: M001
provides:
  - Production-ready TypeScript monorepo template with four apps and six shared packages
  - Turborepo + pnpm workspace with build/dev/lint/check-types pipeline
  - HonoJS API (port 3001) with typed RPC exports
  - NestJS API (port 3002) with decorator-based DI
  - Next.js web app (port 3000) with shadcn/ui + TanStack Query
  - Expo React Native app (port 8081) with web output
  - Shared packages — env (Zod validation), db (Drizzle + SQLite), shared (types/schemas), api-client (Hono RPC), eslint-config, typescript-config
  - Comprehensive documentation — root README + per-app/package READMEs + .env.example files
key_decisions:
  - D001: pnpm as package manager
  - D002: Pick-your-backend (HonoJS or NestJS)
  - D003: No UI sharing between web and mobile — business logic only
  - D004: SQLite default + PostgreSQL adapter for production
  - D005: Zod env validation factory in packages/env, per-app derived schemas
  - D006: Hono RPC for end-to-end type safety
  - D010: ESLint pinned to 9.x (React plugins don't support 10 yet)
  - D012: pnpm catalog for shared dependency versions
  - D014: tsup for shared package builds
  - D015: Zod 4 as validation library
  - D019: api-client depends on honojs app for AppType (type-only)
  - D023: NestJS dev mode uses @swc-node/register for decorator metadata
  - D024: NestJS build uses tsc (not tsup) to preserve decorators
  - D027: @t3-oss/env-nextjs for Next.js env validation
  - D029: Tailwind CSS v4 CSS-first config
  - D032: Expo tsconfig extends expo/tsconfig.base (not @repo/typescript-config)
  - D034: @t3-oss/env-core for Expo env validation with EXPO_PUBLIC_ prefix
patterns_established:
  - "@repo/ scoped workspace packages with pnpm catalog for version consistency"
  - "tsup for shared library builds (ESM + DTS), tsc for NestJS (decorator metadata)"
  - "@swc-node/register/esm-register for NestJS dev mode on Node 24"
  - "Per-app env.ts derived from packages/env createEnv factory"
  - "Idempotent CREATE TABLE IF NOT EXISTS at app startup (no migration system yet)"
  - "CORS middleware on Hono API for cross-origin frontend access"
  - "Turbo pipeline: build depends on ^build, dev is persistent/uncached"
observability_surfaces:
  - "GET /api/health on Hono (:3001) and NestJS (:3002) — returns uptime and timestamp"
  - "Env validation fails fast at startup with clear error messages per app"
  - "pnpm build / pnpm lint / pnpm check-types as workspace-wide verification commands"
requirement_outcomes:
  - id: R001
    from_status: active
    to_status: validated
    proof: "pnpm install resolves all 11 workspaces without errors; turbo.json pipeline works"
  - id: R002
    from_status: active
    to_status: validated
    proof: "packages/typescript-config provides base, library, react, next configs; all apps/packages extend from them"
  - id: R003
    from_status: active
    to_status: validated
    proof: "pnpm lint passes 14 tasks clean; packages/eslint-config provides shared flat configs"
  - id: R004
    from_status: active
    to_status: validated
    proof: "packages/env exports createEnv + z; all 4 apps have src/env.ts with per-app Zod schemas"
  - id: R005
    from_status: active
    to_status: validated
    proof: "packages/db exports Drizzle schema + createDb factory with SQLite; used by honojs and nestjs apps"
  - id: R006
    from_status: active
    to_status: validated
    proof: "packages/shared exports User, ApiResponse types + Zod schemas; imported by all 4 apps"
  - id: R007
    from_status: active
    to_status: validated
    proof: "apps/honojs starts on :3001, /api/health /api/users /api/posts endpoints respond with valid JSON"
  - id: R008
    from_status: active
    to_status: validated
    proof: "apps/nestjs starts on :3002, /api/health /api/users /api/posts endpoints respond with valid JSON"
  - id: R009
    from_status: active
    to_status: validated
    proof: "apps/nextjs starts on :3000, renders page with shadcn/ui components and TanStack Query data fetching"
  - id: R010
    from_status: active
    to_status: validated
    proof: "apps/react-native starts on :8081 (web), Expo web output renders with TanStack Query integration"
  - id: R011
    from_status: active
    to_status: validated
    proof: "packages/api-client exports createApiClient typed with Hono AppType; used by nextjs and react-native apps"
  - id: R012
    from_status: active
    to_status: validated
    proof: "All 4 apps have src/env.ts + .env.example; env validation runs at startup"
  - id: R013
    from_status: active
    to_status: validated
    proof: "Root README + 4 app READMEs + 6 package READMEs exist with architecture docs and quick start"
  - id: R014
    from_status: active
    to_status: validated
    proof: "pnpm dev starts all 4 apps — Hono :3001, NestJS :3002, Next.js :3000, Expo :8081 — all respond to HTTP"
  - id: R015
    from_status: active
    to_status: validated
    proof: "Development done on gsd/ branches, squash-merged to main"
  - id: R016
    from_status: active
    to_status: validated
    proof: "All 4 apps have .env.example; root README references setup instructions"
  - id: R017
    from_status: active
    to_status: validated
    proof: "turbo.json defines build, dev, lint, check-types, format; all pass across workspace"
  - id: R018
    from_status: active
    to_status: validated
    proof: ".gitignore, .npmrc, .prettierrc at root; .npmrc has node-linker=hoisted for Expo compat"
duration: "~12 hours"
verification_result: passed
completed_at: 2026-03-13T11:30:00.000Z
---

# M001: TypeScript Monorepo Starter Template

**Clone-ready TypeScript monorepo with HonoJS + NestJS APIs, Next.js web, Expo mobile, and six shared packages — all wired and working from `pnpm dev`.**

## What Happened

Built a complete monorepo template across seven slices, starting from an empty repo.

**S01 (Foundation):** Established Turborepo + pnpm workspace infrastructure. Created `pnpm-workspace.yaml` with workspace globs and version catalog, `turbo.json` with build/dev/lint/check-types/format pipeline, shared TypeScript configs (base, library, react, next), shared ESLint flat configs, and root Prettier/gitignore/npmrc. ESLint pinned to 9.x due to React plugin compatibility.

**S02 (Shared Packages):** Built three core shared packages. `packages/env` re-exports `createEnv` from `@t3-oss/env-core` and `z` from Zod 4. `packages/db` provides Drizzle ORM schema (users, posts tables) with SQLite via better-sqlite3, exporting a `createDb` factory. `packages/shared` exports common types (`User`, `ApiResponse`) and Zod schemas. All use tsup for ESM + DTS builds.

**S03 (HonoJS + API Client):** Created `apps/honojs` with `@hono/node-server`, three route modules (health, users, posts), CORS middleware, and idempotent table bootstrapping. Built `packages/api-client` that imports Hono's `AppType` from the honojs app and exports a typed `createApiClient` using Hono RPC — end-to-end type safety without codegen.

**S04 (NestJS):** Created `apps/nestjs` as a standalone NestJS app (not NestJS monorepo mode) within Turborepo. Key challenge: decorator metadata requires SWC for dev mode (`@swc-node/register/esm-register` on Node 24) and tsc for production builds (tsup/esbuild strip decorators). Same endpoint structure as HonoJS — health, users, posts using shared db/env/shared packages.

**S05 (Next.js):** Created `apps/nextjs` with Next.js, Tailwind CSS v4 (CSS-first config, no JS config), and shadcn/ui components. TanStack Query configured with `@repo/api-client` for typed data fetching from the Hono API. Used `@t3-oss/env-nextjs` for `NEXT_PUBLIC_` prefix enforcement.

**S06 (Expo):** Created `apps/react-native` with Expo SDK, expo-router for file-based routing, and TanStack Query + `@repo/api-client` for data fetching. Expo's tsconfig extends `expo/tsconfig.base` (not `@repo/typescript-config`) because Metro requires specific JSX and module settings. Used `@t3-oss/env-core` with `EXPO_PUBLIC_` client prefix.

**S07 (Documentation):** Wrote comprehensive root README with quick start, project structure, app/package descriptions, available scripts, design decisions, and contributing guidance. Added per-app and per-package READMEs. Verified `.env.example` files in all apps. Final integration test: fresh `pnpm install` → `pnpm dev` → all apps respond.

## Cross-Slice Verification

| Success Criterion | Result | Evidence |
|---|---|---|
| `pnpm install` resolves all workspaces | ✅ Pass | 11 workspace projects resolve, lockfile up to date |
| `pnpm dev` starts all four apps with working dummy content | ✅ Pass | Hono :3001, NestJS :3002, Next.js :3000, Expo :8081 all respond |
| `pnpm build` builds all packages and apps | ✅ Pass | 8 tasks successful (all cached on repeat) |
| `pnpm lint` and `pnpm check-types` pass clean | ✅ Pass | 14 lint tasks, 13 check-types tasks pass |
| Each app has Zod-validated env config from packages/env | ✅ Pass | All 4 apps have src/env.ts + .env.example |
| Shared packages imported and used by apps | ✅ Pass | honojs/nestjs use env+db+shared; nextjs/react-native use env+shared+api-client |
| Root README + per-app/package READMEs | ✅ Pass | 12 README.md files across project |

## Requirement Changes

- R001: active → validated — pnpm install resolves 11 workspaces; turbo pipeline works
- R002: active → validated — packages/typescript-config provides 4 tsconfig bases; all packages extend them
- R003: active → validated — pnpm lint passes 14 tasks; shared ESLint flat config in packages/eslint-config
- R004: active → validated — packages/env exports createEnv+z; all apps derive per-app env schemas
- R005: active → validated — packages/db has Drizzle schema + SQLite; used by honojs and nestjs
- R006: active → validated — packages/shared exports types and schemas; imported by all 4 apps
- R007: active → validated — apps/honojs serves on :3001 with health/users/posts endpoints
- R008: active → validated — apps/nestjs serves on :3002 with health/users/posts endpoints
- R009: active → validated — apps/nextjs renders on :3000 with shadcn/ui + TanStack Query
- R010: active → validated — apps/react-native serves web on :8081 via Expo
- R011: active → validated — packages/api-client exports typed Hono RPC client; used by nextjs and react-native
- R012: active → validated — all 4 apps have env.ts + .env.example with per-app schemas
- R013: active → validated — root README + 4 app + 6 package READMEs written
- R014: active → validated — pnpm dev at root starts all 4 apps simultaneously
- R015: active → validated — development on gsd/ branches, squash-merged to main
- R016: active → validated — .env.example in all apps; root README has setup instructions
- R017: active → validated — turbo.json defines build/dev/lint/check-types/format; all pass
- R018: active → validated — .gitignore, .npmrc (node-linker=hoisted), .prettierrc at root

## Forward Intelligence

### What the next milestone should know
- The template is functionally complete. Natural next steps: CI/CD (GitHub Actions), Docker configs, testing framework setup, or auth scaffolding.
- pnpm catalog in `pnpm-workspace.yaml` is the single source of truth for shared dependency versions — update there, not in individual package.json files.
- The Hono→api-client→frontend type chain is the most sophisticated integration — changes to Hono route types propagate end-to-end.

### What's fragile
- `node-linker=hoisted` in .npmrc — required for Expo but affects the entire workspace. If strict isolation is needed later, this may need a workaround.
- ESLint 9.x pin (D010) — React plugins don't support ESLint 10 yet. Will need updating when they do.
- `@swc-node/register/esm-register` for NestJS dev — ties to Node 24's ESM registration API. May change across Node versions.
- Idempotent `CREATE TABLE IF NOT EXISTS` at startup (D022) — works for dev template but should be replaced with proper migrations for production use.

### Authoritative diagnostics
- `pnpm build && pnpm lint && pnpm check-types` — full workspace verification in one sequence
- `/api/health` endpoints on Hono (:3001) and NestJS (:3002) — confirms apps are live and DB connected
- Turbo cache status in build output — `FULL TURBO` means no changes since last build

### What assumptions changed
- Assumed Expo would need custom Metro config for monorepo — Expo SDK 52+ handles it automatically with `expo/tsconfig.base`
- Assumed tsup would work for NestJS — it doesn't; esbuild strips decorator metadata, requiring tsc for builds and SWC for dev
- Assumed `@swc-node/register/esm` would work on Node 24 — needed `esm-register` entry point instead (deprecated loader hooks)
- Assumed a single tsconfig base would work for all React apps — Expo needs `jsx: "react-native"` which conflicts with web React config

## Files Created/Modified

- `pnpm-workspace.yaml` — workspace globs + pnpm catalog for shared versions
- `turbo.json` — Turborepo task pipeline
- `package.json` — root scripts and workspace config
- `.npmrc` — pnpm config with node-linker=hoisted
- `.prettierrc` — Prettier config
- `.gitignore` — comprehensive ignore patterns
- `packages/typescript-config/` — 4 tsconfig bases (base, library, react, next)
- `packages/eslint-config/` — shared ESLint flat configs (base, library, react, next)
- `packages/env/` — createEnv + z re-exports from @t3-oss/env-core and Zod
- `packages/db/` — Drizzle schema (users, posts), createDb factory, SQLite adapter
- `packages/shared/` — User, ApiResponse types + Zod schemas
- `packages/api-client/` — Hono RPC typed client factory
- `apps/honojs/` — Hono API with health/users/posts routes, CORS, env validation
- `apps/nestjs/` — NestJS API with health/users/posts modules, SWC dev, tsc build
- `apps/nextjs/` — Next.js with Tailwind v4, shadcn/ui, TanStack Query, api-client
- `apps/react-native/` — Expo app with expo-router, TanStack Query, api-client
- `README.md` — comprehensive root documentation
- `apps/*/README.md` — per-app documentation
- `packages/*/README.md` — per-package documentation
- `apps/*/.env.example` — environment variable templates
