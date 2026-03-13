# @repo/nestjs

> 🇹🇷 [Türkçe](./README.tr.md)

Enterprise-grade REST API server built with [NestJS](https://nestjs.com/).

## Tech Stack

- **NestJS** — modular Node.js framework with dependency injection
- **@swc-node/register** — SWC-based TypeScript loader for dev mode (preserves decorator metadata)
- **Drizzle ORM** — type-safe database access (SQLite via `@repo/db`)
- **class-validator / class-transformer** — DTO validation and transformation
- **@repo/env** — environment variable validation
- **@repo/shared** — shared Zod schemas and types

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start dev server with `node --watch` + SWC register |
| `pnpm build` | Compile with `tsc` (preserves decorator metadata) |
| `pnpm start` | Run compiled production build (`node dist/main.js`) |
| `pnpm lint` | Run ESLint |
| `pnpm check-types` | Type-check with `tsc --noEmit` |

## Environment Variables

Copy the example file and adjust as needed:

```sh
cp .env.example .env
```

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3002` |
| `NODE_ENV` | `development` \| `production` \| `test` | `development` |
| `DATABASE_URL` | SQLite database file path | `./data/dev.db` |

See [`src/env.ts`](src/env.ts) for the full validation schema.

## Usage

```sh
# Start development server on port 3002
pnpm dev

# Build and run in production
pnpm build
pnpm start
```

## Notes

- Dev mode uses `@swc-node/register/esm-register` because esbuild/tsx cannot emit decorator metadata required by NestJS DI.
- Production build uses `tsc` (not tsup) for the same reason — tsup's esbuild backend strips decorator metadata.

## Docker

The Dockerfile uses a multi-stage build (base → deps → build → production) and must be built from the **monorepo root**:

```bash
# Build production image
docker build -f apps/nestjs/Dockerfile -t repo-nestjs .

# Run
docker run -p 3002:3002 -e PORT=3002 -e NODE_ENV=production -e DATABASE_URL=./data/prod.db repo-nestjs
```

Or use docker-compose from the repo root:

```bash
# Development (hot-reload via volume mounts)
pnpm docker:dev

# Production
pnpm docker:prod
```

Production image size: **~108 MB** (node:22-alpine base).

## Port

Default: **3002** (avoids collision with Next.js at 3000 and Hono at 3001)
