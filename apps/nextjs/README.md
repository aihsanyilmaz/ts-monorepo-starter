# @repo/nextjs

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

## Port

Default: **3000** (Next.js default)
