# @repo/nextjs

> 🇹🇷 [Türkçe](./README.tr.md)

Web application built with [Next.js](https://nextjs.org/) + Tailwind CSS v4 + shadcn/ui.

## Tech Stack

- **Next.js 16** — React framework with App Router
- **Tailwind CSS v4** — CSS-first configuration
- **shadcn/ui** — accessible UI components
- **TanStack Query** — data fetching and caching
- **Hono RPC client** — type-safe API calls (imports `AppType` from `@repo/honojs`)
- **t3-env** — fail-fast environment variable validation

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start dev server with hot reload |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:3001` | Hono API base URL |

## Port

Default: **3000**
