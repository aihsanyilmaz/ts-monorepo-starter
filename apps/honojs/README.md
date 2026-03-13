# @repo/honojs

> 🇹🇷 [Türkçe](./README.tr.md)

Lightweight REST API server built with [Hono](https://hono.dev/) and the `@hono/node-server` adapter.

## Tech Stack

- **Hono** — fast, lightweight web framework
- **@hono/node-server** — Node.js adapter for Hono
- **@hono/zod-validator** — request validation via Zod
- **Drizzle ORM** — type-safe database access (SQLite via `@repo/db`)
- **@repo/env** — environment variable validation
- **@repo/shared** — shared Zod schemas and types

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start dev server with hot reload (`tsx watch`) |
| `pnpm build` | Build for production (`tsup`) |
| `pnpm lint` | Run ESLint |
| `pnpm check-types` | Type-check with `tsc --noEmit` |

## Environment Variables

Copy the example file and adjust as needed:

```sh
cp .env.example .env
```

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3001` |
| `NODE_ENV` | `development` \| `production` \| `test` | `development` |
| `DATABASE_URL` | SQLite database file path | `./data/dev.db` |

See [`src/env.ts`](src/env.ts) for the full validation schema.

## Usage

```sh
# Start development server on port 3001
pnpm dev

# Build and run production bundle
pnpm build
node dist/index.js
```

The API exports its `AppType` for use by `@repo/api-client`, enabling end-to-end type-safe RPC clients in Next.js and Expo apps.

## Docker

The Dockerfile uses a multi-stage build (base → deps → build → production) and must be built from the **monorepo root**:

```bash
# Build production image
docker build -f apps/honojs/Dockerfile -t repo-honojs .

# Run
docker run -p 3001:3001 -e PORT=3001 -e NODE_ENV=production -e DATABASE_URL=./data/prod.db repo-honojs
```

Or use docker-compose from the repo root:

```bash
# Development (hot-reload via volume mounts)
pnpm docker:dev

# Production
pnpm docker:prod
```

Production image size: **~101 MB** (node:22-alpine base).

## Port

Default: **3001** (avoids collision with Next.js at 3000)
