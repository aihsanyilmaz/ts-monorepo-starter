# M001: TypeScript Monorepo Starter Template — Context

**Gathered:** 2026-03-13
**Status:** Ready for planning

## Project Description

Open-source TypeScript monorepo starter template. Turborepo + pnpm workspace with four app targets (HonoJS, NestJS, Next.js, Expo React Native) and shared packages (env validation, database, types, API client, tooling configs). Designed as a "clone and go" template with comprehensive documentation.

## Why This Milestone

This is the entire project — building the template from scratch. No prior code exists. The milestone delivers a complete, working, documented starter template that the open-source community can clone and use immediately.

## User-Visible Outcome

### When this milestone is complete, the user can:

- Clone the repo, run `pnpm install && pnpm dev`, and see all apps running with dummy pages/endpoints
- Choose between HonoJS or NestJS as their backend
- Use Next.js + shadcn/ui for web (site/blog/dashboard)
- Use Expo for mobile (iOS/Android) + web output
- Share types, validation schemas, env config, and API client across all apps
- Read clear documentation explaining the architecture and how to get started

### Entry point / environment

- Entry point: `git clone` → `pnpm install` → `pnpm dev`
- Environment: local dev
- Live dependencies involved: none (SQLite default, no external services required)

## Completion Class

- Contract complete means: all apps build and dev-serve without errors, shared packages import correctly
- Integration complete means: apps can import and use shared packages (env, db, shared, api-client)
- Operational complete means: `pnpm dev` starts all apps, `pnpm build` builds all apps, `pnpm lint` passes

## Final Integrated Acceptance

To call this milestone complete, we must prove:

- `pnpm dev` at root starts all four apps with working dummy pages/endpoints
- Each app imports and uses at least one shared package (env validation at minimum)
- `pnpm build` succeeds for all packages
- `pnpm lint` and `pnpm check-types` pass clean
- README clearly explains architecture and getting started

## Risks and Unknowns

- Expo in pnpm monorepo may need `node-linker=hoisted` in `.npmrc` — could affect other packages
- shadcn/ui monorepo setup has specific `components.json` and alias requirements
- NestJS within Turborepo workspace (not NestJS monorepo mode) needs careful tsconfig setup
- Hono RPC client in a separate package needs correct type export chain

## Existing Codebase / Prior Art

- Empty repo — `.gitignore` only, no existing code

> See `.gsd/DECISIONS.md` for all architectural and pattern decisions — it is an append-only register; read it during planning, append to it during execution.

## Relevant Requirements

- R001-R003 — Monorepo foundation (Turborepo, TypeScript, ESLint/Prettier)
- R004-R006 — Shared packages (env, db, shared)
- R007-R010 — App targets (HonoJS, NestJS, Next.js, Expo)
- R011 — Hono RPC API client
- R012-R018 — Cross-cutting (env per app, docs, dev experience, tooling)

## Scope

### In Scope

- All workspace infrastructure (Turborepo, pnpm, configs)
- Four app scaffolds with working dummy content
- Five shared packages with real implementations
- Comprehensive documentation (root + per-package/app READMEs)
- ESLint + Prettier across workspace
- Zod env validation per app
- Drizzle ORM with SQLite default + PostgreSQL readiness
- Hono RPC type-safe client

### Out of Scope / Non-Goals

- CI/CD pipelines (GitHub Actions, etc.)
- Authentication / user management
- Production deployment configuration
- Real business logic beyond dummy examples
- Testing framework setup (may add if natural, but not required)

## Technical Constraints

- pnpm as package manager (Turborepo's recommended companion)
- TypeScript strict mode across all packages
- Expo SDK 52+ (automatic Metro monorepo support)
- Node.js 18+ (minimum for all packages)
- `.npmrc` may need `node-linker=hoisted` for Expo — test and document if needed

## Integration Points

- `packages/env` → all apps (env validation base)
- `packages/db` → backend apps (Drizzle schema)
- `packages/shared` → all apps (types, Zod schemas)
- `packages/api-client` → frontend apps (Hono RPC client, only with HonoJS backend)
- `packages/eslint-config` → all apps and packages (lint rules)
- `packages/typescript-config` → all apps and packages (tsconfig bases)

## Open Questions

- Expo `.npmrc` `node-linker=hoisted` requirement — need to test if this breaks other packages or if SDK 52+ handles it differently
- shadcn/ui monorepo component sharing pattern — `@workspace/ui` or installed directly in nextjs app
