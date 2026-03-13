# ts-monorepo-starter

A full-stack TypeScript monorepo template with **pnpm workspaces** and **Turborepo**. Ships two backend options (Hono and NestJS), a Next.js web app, and an Expo React Native app — all sharing typed packages for database access, environment validation, API client, and business logic.

**Stack:** TypeScript · pnpm · Turborepo · Hono · NestJS · Next.js · Expo · Drizzle ORM · SQLite · Zod · Tailwind CSS · shadcn/ui

## Quick Start

```bash
git clone <your-repo-url> ts-monorepo-starter
cd ts-monorepo-starter
pnpm install

# Start all apps in dev mode
pnpm dev
```

That's it. All four apps start with sensible defaults — no `.env` files required for development:

| App           | URL                     |
|---------------|-------------------------|
| Next.js       | http://localhost:3000    |
| Hono API      | http://localhost:3001    |
| NestJS API    | http://localhost:3002    |
| Expo (web)    | http://localhost:8081    |

> **Note:** Backend apps (Hono, NestJS) ship with `.env.example` files. Defaults are built into the env validation layer, so `pnpm dev` works out of the box. Copy `.env.example` to `.env` only when you need to override defaults.

## Project Structure

```
├── apps/
│   ├── honojs/           # Lightweight REST API (Hono + Node.js adapter)
│   ├── nestjs/           # Enterprise REST API (NestJS + SWC)
│   ├── nextjs/           # Web app (Next.js + Tailwind + shadcn/ui)
│   └── react-native/     # Mobile + web app (Expo SDK)
├── packages/
│   ├── api-client/       # Type-safe Hono RPC client
│   ├── db/               # Drizzle ORM schema + SQLite connection
│   ├── env/              # Zod-based env validation (createEnv + z re-exports)
│   ├── eslint-config/    # Shared ESLint flat configs (base, library, react, next)
│   ├── shared/           # Shared types, schemas, and utilities
│   └── typescript-config/ # Shared tsconfig bases (base, library, react, next)
├── pnpm-workspace.yaml   # Workspace + version catalog
├── turbo.json            # Turborepo pipeline config
└── package.json          # Root scripts
```

## Apps

| App | Framework | Port | Description |
|-----|-----------|------|-------------|
| `apps/honojs` | [Hono](https://hono.dev/) | 3001 | Lightweight REST API with typed RPC exports. Uses `@hono/node-server` adapter, Drizzle ORM for data access, and Zod for request validation. |
| `apps/nestjs` | [NestJS](https://nestjs.com/) | 3002 | Enterprise-grade REST API with decorator-based DI. Uses SWC for dev mode (`--watch`), tsc for production builds. |
| `apps/nextjs` | [Next.js](https://nextjs.org/) | 3000 | Web application with Tailwind CSS v4 and shadcn/ui components. Fetches data from Hono API via the typed `@repo/api-client`. |
| `apps/react-native` | [Expo](https://expo.dev/) | 8081 | Cross-platform mobile app with web output. Uses Expo SDK with `expo start --web` for development. |

## Packages

| Package | Purpose |
|---------|---------|
| `@repo/api-client` | Type-safe Hono RPC client — imports `AppType` from `apps/honojs` for end-to-end type safety without codegen. |
| `@repo/db` | Drizzle ORM schema definitions and SQLite database connection. Shared across backend apps. |
| `@repo/env` | Re-exports `createEnv` from `@t3-oss/env-core` and `z` from Zod. Each app defines its own env schema using these primitives. |
| `@repo/shared` | Shared TypeScript types, Zod schemas, constants, and utility functions. |
| `@repo/eslint-config` | ESLint flat config presets: `base`, `library`, `react`, `next`. |
| `@repo/typescript-config` | Shared `tsconfig.json` bases: `base`, `library`, `react`, `next`. |

## Environment Variables

This template uses a **Zod-based, fail-fast** env validation pattern:

1. `@repo/env` provides `createEnv` and `z` as a single import
2. Each app defines its own env schema (e.g. `apps/honojs/src/env.ts`)
3. Invalid or missing env vars cause an immediate startup error with a clear message

Backend apps (Hono, NestJS) have **sensible defaults** for all env vars — they work without any `.env` file. See each app's `.env.example` for available variables:

- `apps/honojs/.env.example` — `PORT`, `NODE_ENV`, `DATABASE_URL`
- `apps/nestjs/.env.example` — `PORT`, `NODE_ENV`, `DATABASE_URL`

Next.js uses `@t3-oss/env-nextjs` with `NEXT_PUBLIC_` prefix enforcement. Expo uses `@t3-oss/env-core` with `EXPO_PUBLIC_` prefix.

## Scripts

### Root-level (via Turborepo)

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in dev mode (watch/HMR) |
| `pnpm build` | Build all apps and packages |
| `pnpm lint` | Lint all workspaces |
| `pnpm check-types` | Type-check all workspaces |
| `pnpm format` | Format all files with Prettier |
| `pnpm format:check` | Check formatting without writing |

### Filtering

Run commands for a specific workspace using Turborepo's `--filter`:

```bash
pnpm dev --filter honojs          # Start only the Hono API
pnpm build --filter @repo/shared  # Build only the shared package
pnpm lint --filter nextjs         # Lint only the Next.js app
```

## Architecture Notes

### pnpm Catalog

All shared dependency versions are pinned in a single `catalog:` block in `pnpm-workspace.yaml`. Workspace packages reference versions with `"catalog:"` instead of hardcoded semver — one place to update TypeScript, ESLint, Zod, etc.

### Hono RPC Type Chain

`@repo/api-client` imports `AppType` from `apps/honojs` and creates a typed Hono RPC client. This gives frontend apps end-to-end type safety for API calls — no codegen, no OpenAPI, just TypeScript inference from the server routes.

```
apps/honojs (defines routes + AppType)
    ↓ type export
packages/api-client (creates typed hono/client)
    ↓ used by
apps/nextjs, apps/react-native
```

### NestJS Build Strategy

- **Dev:** `node --watch --import @swc-node/register/esm-register` — SWC compiles TypeScript on the fly with decorator metadata support
- **Build:** `tsc` — esbuild/tsup strip decorator metadata, so tsc is used for production builds

### Database

SQLite with Drizzle ORM for zero-config local development. Tables are bootstrapped at app startup with `CREATE TABLE IF NOT EXISTS`. No migration system is included by default — add one when your schema stabilizes.

## License

MIT
