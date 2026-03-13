# S05: Next.js Web App — Research

**Date:** 2026-03-13

## Summary

S05 scaffolds a Next.js App Router application at `apps/nextjs` with shadcn/ui components, TanStack Query for data fetching via `@repo/api-client`, and Zod-based env validation via `@t3-oss/env-nextjs`. The codebase already has the nextjs tsconfig base (`packages/typescript-config/nextjs.json`), shared ESLint config, and a working api-client package exporting `createApiClient()` typed against the Hono `AppType`.

The main integration risks are: (1) shadcn/ui monorepo alias resolution in `components.json`, (2) ESLint React plugin compatibility with the existing flat config + ESLint 9.x, and (3) `transpilePackages` configuration for workspace packages. All three are well-documented and solvable with known patterns.

Next.js 16 is the current latest stable (16.1.6). It uses React 19, supports Tailwind CSS v4 natively, and the App Router is the default. shadcn/ui v4 supports Tailwind v4 and has native monorepo CLI support. TanStack Query v5 has a well-documented Next.js App Router pattern with `QueryClientProvider` as a client component.

## Recommendation

Scaffold the Next.js app manually (not `create-next-app`) to keep full control over config and avoid unnecessary boilerplate. Use:

- **Next.js 16.x** — latest stable, React 19, native Tailwind v4 support
- **shadcn/ui** — init via CLI with `--monorepo` flag for proper alias setup, install a few demo components (Button, Card, etc.)
- **Tailwind CSS v4** — CSS-first config, no `tailwind.config.js` needed
- **TanStack Query v5** — `QueryClientProvider` pattern from their SSR docs, client components for data fetching
- **`@t3-oss/env-nextjs`** — instead of `@t3-oss/env-core`, because it handles `NEXT_PUBLIC_` prefix enforcement and client/server separation
- **ESLint** — extend `@repo/eslint-config` with `eslint-plugin-react-hooks` and `@next/eslint-plugin-next` for Next.js-specific rules

The env pattern deviates slightly from S03/S04 (which use `@t3-oss/env-core` directly) because Next.js needs client-side env exposure with the `NEXT_PUBLIC_` prefix. `@t3-oss/env-nextjs` wraps `env-core` and enforces this automatically.

## Don't Hand-Roll

| Problem | Existing Solution | Why Use It |
|---------|------------------|------------|
| Env validation with NEXT_PUBLIC_ | `@t3-oss/env-nextjs` | Enforces client/server prefix rules, wraps env-core |
| UI component library | shadcn/ui CLI | Generates accessible, customizable components with proper Tailwind v4 CSS |
| Data fetching / cache | TanStack Query | Server-state management, prevents waterfall fetches, SSR hydration support |
| API type safety | `@repo/api-client` (`createApiClient`) | Already built in S03, provides typed Hono RPC client |
| CSS utility framework | Tailwind CSS v4 | Zero-config with Next.js 16, CSS-first approach |

## Existing Code and Patterns

- `packages/typescript-config/nextjs.json` — extends `react.json`, adds `allowJs`, `noEmit`, Next.js plugin. Use as `extends` target in `apps/nextjs/tsconfig.json`
- `packages/api-client/src/index.ts` — exports `createApiClient(baseUrl)` returning typed `hc<AppType>`. Import in Next.js client components for API calls
- `apps/honojs/src/env.ts` — pattern for env validation with `createEnv()`. Next.js version will use `@t3-oss/env-nextjs` instead of `@t3-oss/env-core` but same shape
- `apps/honojs/eslint.config.mjs` / `apps/nestjs/eslint.config.mjs` — both just re-export `@repo/eslint-config`. Next.js app will extend with React/Next.js rules
- `packages/eslint-config/index.mjs` — shared base config with `eslint.configs.recommended`, `tseslint.configs.recommended`, Prettier, Turbo. Already ignores `.next/` directory
- `packages/shared/src/schemas/` — `UserSchema`, `ApiResponseSchema` — import in Next.js for type-safe rendering
- `apps/honojs/src/routes/` — health, users, posts endpoints — Next.js dummy page will fetch from these via api-client

## Constraints

- **ESLint pinned to 9.x** (D010) — `eslint-plugin-react@^7.37` and `eslint-plugin-react-hooks@^7.0` both support ESLint 9, so this is not a blocker. However, avoid ESLint 10.
- **pnpm workspace** — Next.js needs `transpilePackages` in `next.config.ts` for `@repo/*` workspace packages to be bundled correctly
- **Port 3000** — Next.js defaults to port 3000; HonoJS uses 3001 (D020), NestJS uses 3002 (D025). No conflict.
- **React 19** — Next.js 16 peers on React 19. All React deps (`react`, `react-dom`, `@types/react`, `@types/react-dom`) must be React 19 versions.
- **`type: "module"`** — maintain consistency with other workspace packages. Next.js 16 supports ESM config natively via `next.config.ts`.
- **Tailwind CSS v4** — no `tailwind.config.js` file; configuration is done in CSS via `@import "tailwindcss"` and `@theme` blocks. shadcn/ui v4 is compatible.
- **App Router only** — no Pages Router. Use `app/` directory with `layout.tsx`, `page.tsx` file conventions.
- **`noEmit: true`** in tsconfig — Next.js handles compilation via its own compiler (SWC/Turbopack). TypeScript is type-checking only.

## Common Pitfalls

- **shadcn/ui aliases in monorepo** — `components.json` aliases (`@/components`, `@/lib/utils`) must match `tsconfig.json` paths. With `src/` directory, paths map to `./src/*`. The `shadcn init --monorepo` flag handles this, but verify `components.json` aliases match tsconfig paths.
- **TanStack Query QueryClient in App Router** — must create QueryClient outside React render cycle (module-scope singleton for browser, new instance per request for server). The documented `getQueryClient()` pattern handles this. Do NOT use `useState` for the client.
- **`transpilePackages` missing** — workspace packages imported into Next.js won't be transpiled by default. Must list `@repo/api-client`, `@repo/env`, `@repo/shared` in `next.config.ts` `transpilePackages`. Without this, ESM imports from workspace packages may fail at build time.
- **`@t3-oss/env-nextjs` vs `env-core`** — Using `env-core` in Next.js won't enforce `NEXT_PUBLIC_` prefix rules. Use `env-nextjs` which wraps `env-core` with Next.js-specific validation.
- **`'use client'` directive missing** — TanStack Query hooks (`useQuery`), `QueryClientProvider`, and any component using browser APIs must have `'use client'` at the top. Server Components are the default in App Router.
- **ESLint config composition** — don't use `eslint-config-next` package (it's the old approach and may conflict with our shared flat config). Instead, add `eslint-plugin-react-hooks` and `@next/eslint-plugin-next` directly to the app's flat config, extending `@repo/eslint-config`.

## Open Risks

- **shadcn/ui CLI in monorepo** — the `npx shadcn@latest init --monorepo` command may try to modify root-level files or create a `packages/ui` workspace. We want components installed directly in `apps/nextjs`, not a shared package (per D003 — no UI sharing between web and mobile). May need to skip the CLI and configure manually.
- **Tailwind v4 + shadcn/ui CSS variables** — shadcn/ui v4 uses `@theme` blocks and CSS custom properties for theming. Verify the generated `globals.css` is compatible with Tailwind v4's CSS-first approach (no `tailwind.config.js`).
- **`@t3-oss/env-nextjs` + Zod 4 compatibility** — packages/env re-exports from `zod@^4.0.0` (catalog). `@t3-oss/env-nextjs` peers on `zod: ^3.24.0 || ^4.0.0`, so Zod 4 should work, but edge cases with Zod 4's new API (e.g. `z.email()` vs `z.string().email()`) should be verified.
- **`next build` with workspace deps** — production build may need `outputFileTracingRoot` set to monorepo root (`../../`) for proper file tracing in deployment scenarios. Not strictly needed for dev, but worth setting up for completeness.

## Skills Discovered

| Technology | Skill | Status |
|------------|-------|--------|
| Next.js | `wshobson/agents@nextjs-app-router-patterns` (8.1K installs) | available — recommended for App Router patterns |
| shadcn/ui | `shadcn/ui@shadcn` (14.4K installs) | available — official skill |
| shadcn/ui | `giuseppe-trisciuoglio/developer-kit@shadcn-ui` (9.8K installs) | available |
| TanStack Query | `jezweb/claude-skills@tanstack-query` (2.5K installs) | available |
| Tailwind v4 + shadcn | `jezweb/claude-skills@tailwind-v4-shadcn` (2.7K installs) | available — covers Tailwind v4 specifics with shadcn |

## Requirement Coverage

| Requirement | Role | How This Slice Delivers |
|-------------|------|------------------------|
| R009 | Primary owner | Next.js app with shadcn/ui, TanStack Query, dummy pages |
| R004 | Supporting | Env validation via `@t3-oss/env-nextjs` derived from packages/env pattern |
| R006 | Supporting | Import and render `User` type, `ApiResponse` from `@repo/shared` |
| R011 | Supporting | Use `@repo/api-client` to fetch from Hono API with full type safety |
| R012 | Supporting | `apps/nextjs/env.ts` with `NEXT_PUBLIC_*` and server vars |
| R014 | Supporting | `pnpm dev --filter nextjs` starts Next.js on localhost:3000 |
| R016 | Supporting | `.env.example` documenting required variables |

## Sources

- shadcn/ui monorepo support is now native in CLI with `--monorepo` flag (source: [shadcn/ui docs](https://github.com/shadcn/ui/blob/main/apps/v4/content/docs/(root)/monorepo.mdx))
- TanStack Query SSR pattern for App Router uses module-scope `getQueryClient()` with `HydrationBoundary` (source: [TanStack Query Advanced SSR](https://github.com/tanstack/query/blob/main/docs/framework/react/guides/advanced-ssr.md))
- Next.js `transpilePackages` replaces `next-transpile-modules` for monorepo workspace package bundling (source: [Next.js compiler docs](https://github.com/vercel/next.js/blob/canary/docs/03-architecture/nextjs-compiler.mdx))
- `@t3-oss/env-nextjs` wraps `env-core` with NEXT_PUBLIC_ prefix enforcement (source: [t3-env README](https://www.npmjs.com/package/@t3-oss/env-nextjs))
- ESLint React plugins (`eslint-plugin-react@^7.37`, `eslint-plugin-react-hooks@^7.0`) support ESLint 9 via peer deps (source: npm registry)
- Next.js 16.1.6 is current stable, peers on React 19 (source: npm registry)
