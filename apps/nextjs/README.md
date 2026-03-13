# @repo/nextjs

> 🇹🇷 [Türkçe](./README.tr.md)

Web application built with [Next.js](https://nextjs.org/) 16, [Tailwind CSS](https://tailwindcss.com/) v4, and [shadcn/ui](https://ui.shadcn.com/).

## Tech Stack

- **Next.js 16** — React framework with SSR/SSG
- **Tailwind CSS v4** — CSS-first configuration (no `tailwind.config.js`)
- **shadcn/ui** — accessible component library (components live in `src/components/ui/`)
- **@tanstack/react-query** — data fetching and server state
- **@repo/api-client** — type-safe Hono RPC client
- **@repo/env** — environment variable validation (via `@t3-oss/env-nextjs`)
- **@repo/shared** — shared Zod schemas and types

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start Next.js dev server |
| `pnpm build` | Create production build |
| `pnpm start` | Serve production build |
| `pnpm lint` | Run ESLint |
| `pnpm check-types` | Type-check with `tsc --noEmit` |

## Environment Variables

Copy the example file and adjust as needed:

```sh
cp .env.example .env
```

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | URL of the Hono API server | `http://localhost:3001` |
| `NODE_ENV` | `development` \| `production` \| `test` | `development` |

See [`src/env.ts`](src/env.ts) for the full validation schema. Uses `@t3-oss/env-nextjs` for `NEXT_PUBLIC_` prefix enforcement and client/server separation.

## Usage

```sh
# Start dev server on port 3000
pnpm dev

# Build and serve production
pnpm build
pnpm start
```

## Notes

- Tailwind v4 uses CSS-first configuration — theme customization lives in CSS via `@theme`, not a JS config file.
- shadcn/ui components are local to this app (in `src/components/ui/`), not in a shared package.

## Docker

The Dockerfile uses a multi-stage build with Next.js standalone output and must be built from the **monorepo root**:

```bash
# Build production image (NEXT_PUBLIC_API_URL is baked into the client bundle at build time)
docker build -f apps/nextjs/Dockerfile -t repo-nextjs --build-arg NEXT_PUBLIC_API_URL=http://localhost:3001 .

# Run
docker run -p 3000:3000 -e HOSTNAME=0.0.0.0 -e NODE_ENV=production repo-nextjs
```

Or use docker-compose from the repo root:

```bash
# Development (hot-reload via volume mounts)
pnpm docker:dev

# Production
pnpm docker:prod
```

Production image size: **~74 MB** (node:22-alpine base, standalone output).

> **Note:** `output: 'standalone'` in `next.config.ts` enables Next.js to bundle only what's needed for production, producing a minimal Docker image.

## Port

Default: **3000** (Next.js default)
