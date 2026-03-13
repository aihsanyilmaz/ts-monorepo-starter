# @repo/nestjs

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

## Port

Default: **3002** (avoids collision with Next.js at 3000 and Hono at 3001)
