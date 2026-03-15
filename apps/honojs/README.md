# @repo/honojs

> 🇹🇷 [Türkçe](./README.tr.md)

REST API server built with [Hono](https://hono.dev/) + SQLite + Drizzle ORM.

## Tech Stack

- **Hono** — fast, lightweight web framework with typed RPC exports
- **Drizzle ORM** — type-safe database access (SQLite)
- **Zod** — request validation via `@hono/zod-validator`
- **t3-env** — fail-fast environment variable validation

## Database

Schema, config, and migrations are self-contained in this app:

```
src/db/schema.ts      # Drizzle schema (tables)
drizzle.config.ts     # Drizzle Kit config
drizzle/              # Generated migration files
```

Migrations run automatically on startup. After changing the schema:

```bash
pnpm db:generate    # Generate migration from schema diff
pnpm db:studio      # Open Drizzle Studio
```

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start dev server with hot reload (`tsx watch`) |
| `pnpm build` | Build for production (`tsup`) |
| `pnpm db:generate` | Generate Drizzle migration |
| `pnpm db:studio` | Open Drizzle Studio |

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3001` | Server port |
| `NODE_ENV` | `development` | Environment |
| `DATABASE_URL` | `./data/dev.db` | SQLite file path |

## Type Exports

This app exports `AppType` — the inferred type of all Hono routes. Frontend apps import it to create fully typed API clients via `hono/client`:

```ts
import type { AppType } from '@repo/honojs';
import { hc } from 'hono/client';

const client = hc<AppType>('http://localhost:3001');
const res = await client.api.users.$get(); // fully typed
```
