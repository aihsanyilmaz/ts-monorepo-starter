# ts-monorepo-starter

A full-stack TypeScript monorepo template with **pnpm workspaces** and **Turborepo**. One API server, one web app, one mobile app — sharing type-safe API calls with zero codegen.

**Stack:** TypeScript · pnpm · Turborepo · Hono · Next.js · Expo · Drizzle ORM · SQLite · Zod · Tailwind CSS · shadcn/ui · Docker

> 🇹🇷 [Türkçe README](./README.tr.md)

## Quick Start

```bash
git clone <your-repo-url> my-app
cd my-app
pnpm install
pnpm dev
```

| App           | URL                     |
|---------------|-------------------------|
| Next.js       | http://localhost:3000    |
| Hono API      | http://localhost:3001    |
| Expo (web)    | http://localhost:8081    |

No `.env` files required — sensible defaults are built in.

## Project Structure

```
├── apps/
│   ├── honojs/           # REST API (Hono + SQLite + Drizzle ORM)
│   ├── nextjs/           # Web app (Next.js + Tailwind + shadcn/ui)
│   └── react-native/     # Mobile + web app (Expo)
├── packages/
│   ├── eslint-config/    # Shared ESLint flat configs
│   └── typescript-config/ # Shared tsconfig bases
├── docker-compose.yml
├── docker-compose.prod.yml
├── pnpm-workspace.yaml
└── turbo.json
```

**3 apps, 2 config packages.** Each app is self-contained with its own dependencies, types, and database setup. The config packages share lint and TypeScript settings across the workspace.

## Apps

| App | Framework | Port | Description |
|-----|-----------|------|-------------|
| `apps/honojs` | [Hono](https://hono.dev/) | 3001 | REST API with typed RPC exports. SQLite via Drizzle ORM, Zod validation, Drizzle migrations. |
| `apps/nextjs` | [Next.js](https://nextjs.org/) | 3000 | Web app with Tailwind CSS v4 and shadcn/ui. Fetches data from Hono API with end-to-end type safety. |
| `apps/react-native` | [Expo](https://expo.dev/) | 8081 | Cross-platform mobile app. Same typed API client as Next.js. |

## Type-Safe API Chain

The frontend apps import `AppType` from the Hono API and use `hono/client` for fully typed API calls — no codegen, no OpenAPI, just TypeScript inference:

```
apps/honojs (defines routes → exports AppType)
    ↓ type import
apps/nextjs, apps/react-native (hc<AppType> → typed API client)
```

## Environment Variables

Each app defines its own env schema with [t3-env](https://env.t3.gg/) + Zod. Invalid vars cause an immediate startup error.

| App | Env File | Variables |
|-----|----------|-----------|
| `apps/honojs` | `.env.example` | `PORT` (3001), `NODE_ENV`, `DATABASE_URL` (./data/dev.db) |
| `apps/nextjs` | `.env` | `NEXT_PUBLIC_API_URL` (http://localhost:3001) |
| `apps/react-native` | `.env` | `EXPO_PUBLIC_API_URL` (http://localhost:3001) |

## Database

The Hono API uses **SQLite** via Drizzle ORM. Schema, config, and migrations live inside `apps/honojs/`:

```
apps/honojs/
├── src/db/schema.ts      # Drizzle schema (tables)
├── drizzle.config.ts     # Drizzle Kit config
└── drizzle/              # Generated migration files
```

Migrations run automatically on app startup. To generate new migrations after a schema change:

```bash
cd apps/honojs
pnpm db:generate    # Generate migration from schema diff
pnpm db:studio      # Open Drizzle Studio (browser UI)
```

## Scripts

### Root (via Turborepo)

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in dev mode |
| `pnpm build` | Build all apps and packages |
| `pnpm lint` | Lint all workspaces |
| `pnpm check-types` | Type-check all workspaces |
| `pnpm format` | Format with Prettier |

### Filtering

```bash
pnpm dev --filter honojs     # Start only the API
pnpm build --filter nextjs   # Build only the web app
```

## Docker

Two apps are containerized: **Hono API** and **Next.js**. Expo targets mobile devices via its own tooling.

### Development

```bash
pnpm docker:dev
```

Source directories are volume-mounted for hot-reload. No rebuild needed.

### Production

```bash
pnpm docker:prod
```

Multi-stage Dockerfiles produce minimal Alpine images. Features:
- Health checks on all services
- `unless-stopped` restart policy
- Next.js waits for Hono API health before starting
- SQLite data persisted via named Docker volume

```bash
# Override API URL for Next.js client bundle
NEXT_PUBLIC_API_URL=https://api.example.com pnpm docker:prod
```

## Architecture Notes

### pnpm Catalog

Shared dependency versions are pinned in `pnpm-workspace.yaml` under `catalog:`. One place to update TypeScript, ESLint, Zod, etc.

### Why No Shared Packages for Types/DB/Env?

Intentional. Small wrappers (`createEnv`, `hc<AppType>`) aren't worth the overhead of separate packages with their own build configs and tsconfig. Each app imports what it needs directly. The only shared packages are config (ESLint, TypeScript) — which genuinely reduce duplication.

## License

MIT
