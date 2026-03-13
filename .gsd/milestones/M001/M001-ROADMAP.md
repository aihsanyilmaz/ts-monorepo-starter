# M001: TypeScript Monorepo Starter Template

**Vision:** A production-ready, open-source TypeScript monorepo starter template. Clone it, run `pnpm dev`, and get four apps (HonoJS API, NestJS API, Next.js web, Expo mobile) with shared packages — all working out of the box with comprehensive documentation.

## Success Criteria

- `pnpm install` resolves all workspaces without errors
- `pnpm dev` starts all four apps with working dummy content
- `pnpm build` builds all packages and apps successfully
- `pnpm lint` and `pnpm check-types` pass clean across the workspace
- Each app has its own Zod-validated env config derived from `packages/env`
- Shared packages (db, shared, api-client) are imported and used by apps
- Root README + per-app/package READMEs clearly explain architecture and getting started

## Key Risks / Unknowns

- Expo pnpm monorepo compatibility — may need `node-linker=hoisted`
- shadcn/ui monorepo alias configuration
- Hono RPC type export chain across package boundaries
- NestJS standalone within Turborepo workspace (not NestJS monorepo mode)

## Proof Strategy

- Expo monorepo compat → retire in S06 by proving Expo app builds and runs in pnpm workspace
- Hono RPC cross-package types → retire in S03 by proving api-client package exports typed client that compiles
- NestJS in Turborepo → retire in S04 by proving NestJS app builds and serves with shared packages

## Verification Classes

- Contract verification: `pnpm build`, `pnpm lint`, `pnpm check-types` pass
- Integration verification: apps import shared packages, env validation runs at startup
- Operational verification: `pnpm dev` starts all apps, dummy pages/endpoints respond
- UAT / human verification: README walkthrough — clone → install → dev → see it work

## Milestone Definition of Done

This milestone is complete only when all are true:

- All seven slices completed and verified
- All four apps build and dev-serve without errors
- Shared packages are imported and used by at least one app each
- Env validation runs at startup for each app
- `pnpm dev` at root starts everything
- `pnpm build`, `pnpm lint`, `pnpm check-types` pass clean
- Root README + per-app/package READMEs are written and accurate
- Final integration test: fresh clone → `pnpm install` → `pnpm dev` → all apps respond

## Requirement Coverage

- Covers: R001, R002, R003, R004, R005, R006, R007, R008, R009, R010, R011, R012, R013, R014, R015, R016, R017, R018
- Partially covers: none
- Leaves for later: none
- Orphan risks: none

## Slices

- [x] **S01: Monorepo Altyapısı** `risk:low` `depends:[]`
  > After this: `pnpm install` succeeds, `turbo build/lint/check-types` pipeline works, ESLint + Prettier config shared across workspace. Verified by running `pnpm lint` and `pnpm check-types` on empty packages.

- [x] **S02: Paylaşımlı Paketler (env, db, shared)** `risk:medium` `depends:[S01]`
  > After this: `packages/env` exports Zod env validation factory, `packages/db` has Drizzle schema with SQLite, `packages/shared` has common types and Zod schemas. Verified by `pnpm build` on all packages.

- [ ] **S03: HonoJS API App + API Client** `risk:medium` `depends:[S02]`
  > After this: `pnpm dev --filter honojs` starts API on localhost, dummy endpoints respond, `packages/api-client` exports typed Hono RPC client. Verified by HTTP request to dummy endpoint.

- [ ] **S04: NestJS API App** `risk:low` `depends:[S02]`
  > After this: `pnpm dev --filter nestjs` starts API on localhost, dummy endpoints respond, uses shared env/db/shared packages. Verified by HTTP request to dummy endpoint.

- [ ] **S05: Next.js Web App** `risk:medium` `depends:[S02, S03]`
  > After this: `pnpm dev --filter nextjs` starts Next.js on localhost, shadcn/ui dummy page renders, TanStack Query configured, uses api-client. Verified by loading page in browser.

- [ ] **S06: Expo React Native App** `risk:high` `depends:[S02, S03]`
  > After this: `pnpm dev --filter react-native` starts Expo, dummy screen renders on web, uses shared packages and TanStack Query. Verified by Expo web output in browser.

- [ ] **S07: Dokümantasyon & Final Polish** `risk:low` `depends:[S01, S02, S03, S04, S05, S06]`
  > After this: Root README + all app/package READMEs complete, `.env.example` files in place, fresh `pnpm dev` starts everything. Verified by reading README and following setup steps.

## Boundary Map

### S01 → S02

Produces:
- `pnpm-workspace.yaml` — workspace globs (`apps/*`, `packages/*`)
- `turbo.json` — task pipeline (build, dev, lint, check-types, format)
- `packages/typescript-config/` — base tsconfig files (base, node, react, nextjs)
- `packages/eslint-config/` — shared ESLint flat config
- Root `.prettierrc`, `.npmrc`, `.gitignore`
- Root `package.json` with workspace scripts

Consumes:
- nothing (first slice)

### S02 → S03

Produces:
- `packages/env/` — `createEnv()` factory, `z` re-export
- `packages/db/` — Drizzle schema, client factory, SQLite/PostgreSQL adapters
- `packages/shared/` — common types, Zod schemas (e.g. `UserSchema`, `ApiResponse`)

Consumes from S01:
- `packages/typescript-config/` — tsconfig base
- `packages/eslint-config/` — lint rules

### S02 → S04

Produces: same as S02 → S03

Consumes from S01: same as S02 → S03

### S03 → S05

Produces:
- `apps/honojs/` — running Hono API with `AppType` export
- `packages/api-client/` — `hc<AppType>` typed client, exported for frontend use

Consumes from S02:
- `packages/env/` — env validation
- `packages/db/` — Drizzle queries
- `packages/shared/` — types, schemas

### S03 → S06

Produces: same as S03 → S05

Consumes from S02: same as S03 → S05

### S04 (leaf)

Produces:
- `apps/nestjs/` — running NestJS API with dummy endpoints

Consumes from S02:
- `packages/env/` — env validation
- `packages/db/` — Drizzle queries
- `packages/shared/` — types, schemas

### S05 (leaf)

Produces:
- `apps/nextjs/` — running Next.js app with shadcn/ui, TanStack Query, api-client integration

Consumes from S02:
- `packages/env/` — env validation
- `packages/shared/` — types, schemas
Consumes from S03:
- `packages/api-client/` — typed Hono RPC client

### S06 (leaf)

Produces:
- `apps/react-native/` — running Expo app (iOS/Android/Web) with TanStack Query, api-client integration

Consumes from S02:
- `packages/env/` — env validation
- `packages/shared/` — types, schemas
Consumes from S03:
- `packages/api-client/` — typed Hono RPC client

### S07 (integration)

Produces:
- Root `README.md` — architecture overview, quick start, per-app docs
- Per-app and per-package `README.md` files
- `.env.example` files in each app
- Final verification that `pnpm dev` starts all apps

Consumes from S01-S06:
- All apps and packages in working state
