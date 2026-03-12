# Project

## What This Is

An open-source TypeScript monorepo starter template. Provides a production-ready workspace with Turborepo + pnpm, multiple app targets (HonoJS API, NestJS API, Next.js web, Expo React Native), and shared packages (env validation, database, types, API client). Clone → `pnpm install` → `pnpm dev` → everything runs.

## Core Value

A single `git clone` gives you a fully wired, type-safe monorepo with backend + web + mobile apps sharing validation, database schemas, and API client — all working out of the box.

## Current State

Empty repository. No code yet. `.gitignore` and GSD scaffolding only.

## Architecture / Key Patterns

- **Turborepo + pnpm workspaces** — build orchestration, caching, task pipeline
- **apps/** — deployable applications (honojs, nestjs, nextjs, react-native)
- **packages/** — shared libraries (env, db, shared, api-client, eslint-config, typescript-config)
- **Pick-your-backend** — HonoJS (lightweight, edge-ready) or NestJS (enterprise, decorator-based)
- **Env validation** — Zod-based, per-app schemas derived from shared `packages/env` base
- **DB** — Drizzle ORM, SQLite default, PostgreSQL ready
- **Web** — Next.js + shadcn/ui (site, blog, dashboard)
- **Mobile** — Expo (iOS, Android, Web output)
- **API client** — Hono RPC type-safe client (shared between frontends when using HonoJS backend)
- **Business logic sharing** — types, Zod schemas, query hooks shared; UI is platform-specific

## Capability Contract

See `.gsd/REQUIREMENTS.md` for the explicit capability contract, requirement status, and coverage mapping.

## Milestone Sequence

- [ ] M001: TypeScript Monorepo Starter Template — Full template with all apps, packages, docs, and working dummy pages
