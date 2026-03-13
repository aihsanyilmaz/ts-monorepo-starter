# Requirements

## Active

(none — all requirements validated in M001)

## Validated

### R001 — Turborepo + pnpm workspace altyapısı
- Class: core-capability
- Status: validated
- Description: Root `package.json`, `pnpm-workspace.yaml`, `turbo.json` configured. `pnpm install` resolves all workspaces.
- Why it matters: Foundation for everything else — without this, no shared code, no orchestrated builds.
- Source: user
- Primary owning slice: M001/S01
- Supporting slices: none
- Validation: pnpm install resolves 11 workspaces; turbo pipeline works (M001)
- Notes: pnpm workspaces with `apps/*` and `packages/*` globs

### R002 — Paylaşımlı TypeScript config
- Class: quality-attribute
- Status: validated
- Description: `packages/typescript-config` provides base tsconfig files. All apps and packages extend from these.
- Why it matters: Consistent TypeScript behavior across the entire monorepo.
- Source: user
- Primary owning slice: M001/S01
- Supporting slices: none
- Validation: 4 tsconfig bases provided; all apps/packages extend them (M001)
- Notes: Base, app-specific (node, react, next, expo) configs

### R003 — ESLint + Prettier paylaşımlı config
- Class: quality-attribute
- Status: validated
- Description: `packages/eslint-config` provides shared ESLint config. Prettier config at root. `turbo lint` and `turbo format` work across all packages.
- Why it matters: Consistent code style and quality enforcement.
- Source: user
- Primary owning slice: M001/S01
- Supporting slices: none
- Validation: pnpm lint passes 14 tasks clean (M001)
- Notes: ESLint flat config (pinned 9.x per D010), Prettier with consistent rules

### R004 — Zod env validation base paketi
- Class: core-capability
- Status: validated
- Description: `packages/env` provides Zod-based env validation helpers. Each app creates its own `env.ts` derived from this base. Invalid env fails at startup, not runtime.
- Why it matters: Type-safe environment variables, early failure on misconfiguration.
- Source: user
- Primary owning slice: M001/S02
- Supporting slices: M001/S03, M001/S04, M001/S05, M001/S06
- Validation: packages/env exports createEnv+z; all 4 apps have per-app env.ts (M001)
- Notes: Re-exports @t3-oss/env-core createEnv factory; each app derives its own schema

### R005 — Drizzle ORM DB paketi (SQLite default, PostgreSQL ready)
- Class: core-capability
- Status: validated
- Description: `packages/db` provides Drizzle schema definitions and migration config. SQLite for development, PostgreSQL adapter available for production.
- Why it matters: Shared database schema across all backend apps, type-safe queries.
- Source: user
- Primary owning slice: M001/S02
- Supporting slices: M001/S03, M001/S04
- Validation: packages/db exports Drizzle schema + createDb; used by honojs and nestjs (M001)
- Notes: Drizzle Kit for migrations, SQLite via better-sqlite3

### R006 — Paylaşımlı tipler ve Zod şemaları (shared paketi)
- Class: core-capability
- Status: validated
- Description: `packages/shared` provides common TypeScript types and Zod validation schemas used across all apps.
- Why it matters: Single source of truth for data shapes, prevents type drift between frontend and backend.
- Source: user
- Primary owning slice: M001/S02
- Supporting slices: M001/S03, M001/S04, M001/S05, M001/S06
- Validation: exports User, ApiResponse types + Zod schemas; imported by all 4 apps (M001)
- Notes: Runtime validation schemas + inferred TypeScript types

### R007 — HonoJS API app
- Class: core-capability
- Status: validated
- Description: `apps/honojs` — HonoJS API with Node.js adapter (default), edge adapter support. Exports Hono RPC types. Includes dummy endpoints.
- Why it matters: Lightweight, edge-ready API option with type-safe RPC client generation.
- Source: user
- Primary owning slice: M001/S03
- Supporting slices: none
- Validation: apps/honojs serves on :3001; /api/health /api/users /api/posts respond (M001)
- Notes: `@hono/node-server` default, adapter pattern for Cloudflare/Vercel edge

### R008 — NestJS API app
- Class: core-capability
- Status: validated
- Description: `apps/nestjs` — NestJS standalone app with dummy endpoints. Uses shared packages (env, db, shared).
- Why it matters: Enterprise-grade backend alternative for teams that prefer decorator-based architecture.
- Source: user
- Primary owning slice: M001/S04
- Supporting slices: none
- Validation: apps/nestjs serves on :3002; /api/health /api/users /api/posts respond (M001)
- Notes: Standalone NestJS within Turborepo workspace; SWC for dev, tsc for build (D023/D024)

### R009 — Next.js web app
- Class: core-capability
- Status: validated
- Description: `apps/nextjs` — Next.js with shadcn/ui, TanStack Query integration, dummy pages.
- Why it matters: Web-native frontend for sites, blogs, dashboards with SSR/SSG/SEO support.
- Source: user
- Primary owning slice: M001/S05
- Supporting slices: none
- Validation: apps/nextjs renders on :3000 with shadcn/ui + TanStack Query (M001)
- Notes: shadcn/ui components, Tailwind CSS v4, TanStack Query for data fetching

### R010 — Expo React Native app
- Class: core-capability
- Status: validated
- Description: `apps/react-native` — Expo app targeting iOS, Android, and Web. TanStack Query integration, dummy screens.
- Why it matters: Cross-platform mobile + web user app from single codebase.
- Source: user
- Primary owning slice: M001/S06
- Supporting slices: none
- Validation: apps/react-native serves web on :8081 via Expo (M001)
- Notes: Expo SDK 52+, automatic Metro monorepo config

### R011 — Hono RPC type-safe API client paketi
- Class: integration
- Status: validated
- Description: `packages/api-client` exports Hono RPC type-safe client. Usable by both web and mobile apps when HonoJS backend is chosen.
- Why it matters: End-to-end type safety from API to frontend without code generation.
- Source: user
- Primary owning slice: M001/S03
- Supporting slices: M001/S05, M001/S06
- Validation: packages/api-client exports typed createApiClient; used by nextjs and react-native (M001)
- Notes: Re-exports `hc` client typed with HonoJS app's `AppType`

### R012 — Per-app env config derived from packages/env
- Class: core-capability
- Status: validated
- Description: Each app has its own `env.ts` deriving from `packages/env`, plus `.env.example` documenting required variables.
- Why it matters: Type-safe env per app, clear documentation of what each app needs.
- Source: user
- Primary owning slice: M001/S02
- Supporting slices: M001/S03, M001/S04, M001/S05, M001/S06
- Validation: all 4 apps have src/env.ts + .env.example (M001)
- Notes: `.env.example` committed, `.env` gitignored

### R013 — Root README + per-app/package README dokümantasyonu
- Class: launchability
- Status: validated
- Description: Comprehensive root README with quick start, architecture overview, per-app/package descriptions. Each app and package has its own README.
- Why it matters: Open-source template — documentation is the first thing users see.
- Source: user
- Primary owning slice: M001/S07
- Supporting slices: none
- Validation: 12 README.md files — root + 4 apps + 6 packages (M001)
- Notes: Answers "I cloned this, now what?"

### R014 — `pnpm dev` ile tüm app'ler çalışır
- Class: launchability
- Status: validated
- Description: Running `pnpm dev` at root starts all apps. Each app individually startable with `pnpm dev --filter <app>`.
- Why it matters: Template must work out of the box — broken dev experience kills adoption.
- Source: inferred
- Primary owning slice: M001/S07
- Supporting slices: M001/S03, M001/S04, M001/S05, M001/S06
- Validation: pnpm dev starts Hono:3001, NestJS:3002, Next.js:3000, Expo:8081 (M001)
- Notes: Turbo `dev` task with `persistent: true`

### R015 — Git branch workflow (PR-based merge to main)
- Class: constraint
- Status: validated
- Description: Development happens on feature branches, merged to main via PRs.
- Why it matters: Clean git history, standard open-source workflow.
- Source: user
- Primary owning slice: All
- Supporting slices: none
- Validation: development on gsd/ branches, squash-merged to main (M001)
- Notes: GSD slice branches squash-merged to main

### R016 — .env.example dosyaları ve setup documentation
- Class: launchability
- Status: validated
- Description: Each app has `.env.example` with all required variables documented. Root README references these.
- Why it matters: New users need to know exactly what env vars to set.
- Source: inferred
- Primary owning slice: M001/S07
- Supporting slices: M001/S03, M001/S04, M001/S05, M001/S06
- Validation: .env.example in all 4 apps; root README has setup docs (M001)
- Notes: Part of overall documentation effort

### R017 — Turbo task pipeline (build, dev, lint, type-check, format)
- Class: core-capability
- Status: validated
- Description: `turbo.json` defines tasks: build, dev, lint, check-types, format. All work correctly across the workspace.
- Why it matters: Orchestrated, cached, parallel execution of common tasks.
- Source: inferred
- Primary owning slice: M001/S01
- Supporting slices: none
- Validation: turbo.json defines all tasks; pnpm build/lint/check-types pass (M001)
- Notes: build depends on ^build, dev is persistent/uncached

### R018 — Root config dosyaları (.gitignore, .npmrc, etc.)
- Class: quality-attribute
- Status: validated
- Description: Root `.gitignore` (comprehensive), `.npmrc` (pnpm config), `.prettierrc`, and other root configs properly set up.
- Why it matters: Clean workspace setup, no accidental commits of generated/sensitive files.
- Source: inferred
- Primary owning slice: M001/S01
- Supporting slices: none
- Validation: .gitignore, .npmrc (node-linker=hoisted), .prettierrc at root (M001)
- Notes: `.npmrc` uses `node-linker=hoisted` for Expo compatibility

## Deferred

(none)

## Out of Scope

### R100 — CI/CD pipeline (GitHub Actions vb.)
- Class: operability
- Status: out-of-scope
- Description: Automated CI/CD pipelines, GitHub Actions workflows, deployment automation.
- Why it matters: Prevents scope creep — template focuses on local dev experience first.
- Source: inferred
- Primary owning slice: none
- Supporting slices: none
- Validation: n/a
- Notes: Users can add their own CI based on the template structure

### R101 — Auth / kullanıcı yönetimi
- Class: core-capability
- Status: out-of-scope
- Description: Authentication, authorization, user management features.
- Why it matters: Template provides structure, not business logic.
- Source: inferred
- Primary owning slice: none
- Supporting slices: none
- Validation: n/a
- Notes: Dummy endpoints only — no real auth

### R102 — Deployment konfigürasyonu
- Class: operability
- Status: out-of-scope
- Description: Production deployment configs (Docker, Vercel project settings, etc.)
- Why it matters: Each user will deploy differently — template shouldn't assume deployment target.
- Source: inferred
- Primary owning slice: none
- Supporting slices: none
- Validation: n/a
- Notes: Hono edge adapters are included as code pattern, not deployment config

## Traceability

| ID | Class | Status | Primary owner | Supporting | Proof |
|---|---|---|---|---|---|
| R001 | core-capability | validated | M001/S01 | none | pnpm install resolves 11 workspaces |
| R002 | quality-attribute | validated | M001/S01 | none | 4 tsconfig bases; all extend them |
| R003 | quality-attribute | validated | M001/S01 | none | pnpm lint 14 tasks pass |
| R004 | core-capability | validated | M001/S02 | S03,S04,S05,S06 | createEnv+z; 4 per-app env.ts |
| R005 | core-capability | validated | M001/S02 | S03,S04 | Drizzle schema + createDb; used by backends |
| R006 | core-capability | validated | M001/S02 | S03,S04,S05,S06 | types/schemas imported by all 4 apps |
| R007 | core-capability | validated | M001/S03 | none | Hono serves on :3001 |
| R008 | core-capability | validated | M001/S04 | none | NestJS serves on :3002 |
| R009 | core-capability | validated | M001/S05 | none | Next.js renders on :3000 |
| R010 | core-capability | validated | M001/S06 | none | Expo web on :8081 |
| R011 | integration | validated | M001/S03 | S05,S06 | typed client used by frontends |
| R012 | core-capability | validated | M001/S02 | S03,S04,S05,S06 | env.ts + .env.example in all apps |
| R013 | launchability | validated | M001/S07 | none | 12 README.md files |
| R014 | launchability | validated | M001/S07 | S03,S04,S05,S06 | pnpm dev starts all 4 apps |
| R015 | constraint | validated | All | none | gsd/ branches squash-merged |
| R016 | launchability | validated | M001/S07 | S03,S04,S05,S06 | .env.example in all apps |
| R017 | core-capability | validated | M001/S01 | none | turbo tasks all pass |
| R018 | quality-attribute | validated | M001/S01 | none | root configs in place |
| R100 | operability | out-of-scope | none | none | n/a |
| R101 | core-capability | out-of-scope | none | none | n/a |
| R102 | operability | out-of-scope | none | none | n/a |

## Coverage Summary

- Active requirements: 0
- Validated requirements: 18
- Mapped to slices: 18
- Unmapped active requirements: 0
