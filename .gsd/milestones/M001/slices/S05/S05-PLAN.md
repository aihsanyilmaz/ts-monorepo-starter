# S05: Next.js Web App

**Goal:** A working Next.js App Router application at `apps/nextjs` with shadcn/ui components, TanStack Query data fetching via `@repo/api-client`, and Zod-based env validation — fully integrated into the monorepo.
**Demo:** `pnpm dev --filter nextjs` starts Next.js on localhost:3000, browser shows a styled page with shadcn/ui components rendering data fetched from the Hono API.

## Must-Haves

- Next.js 16.x App Router with `type: "module"`, extending `@repo/typescript-config/nextjs.json`
- Env validation via `@t3-oss/env-nextjs` with `NEXT_PUBLIC_API_URL` and `NODE_ENV`
- ESLint config extending `@repo/eslint-config` with `eslint-plugin-react-hooks` and `@next/eslint-plugin-next`
- Tailwind CSS v4 with CSS-first config (no `tailwind.config.js`)
- shadcn/ui components (Button, Card minimum) with proper monorepo aliases
- TanStack Query v5 with `QueryClientProvider` pattern for App Router
- Demo page fetching users from Hono API via `@repo/api-client` and rendering with shadcn components
- `transpilePackages` configured for `@repo/*` workspace packages
- `pnpm build --filter nextjs`, `pnpm lint --filter nextjs`, `pnpm check-types --filter nextjs` all pass
- `.env.example` documenting required variables

## Proof Level

- This slice proves: operational — Next.js app builds, serves, and renders data from a running API
- Real runtime required: yes — dev server + browser verification
- Human/UAT required: no — automated build checks + curl/browser verification sufficient

## Verification

- `pnpm build --filter nextjs` exits 0
- `pnpm lint --filter nextjs` exits 0
- `pnpm check-types --filter nextjs` exits 0
- `pnpm dev --filter nextjs` starts on port 3000 and `curl http://localhost:3000` returns HTML containing the page content
- Demo page renders shadcn/ui components (verified by HTML containing expected class names / component markup)

## Observability / Diagnostics

- Runtime signals: Next.js console output on startup (port, ready message), env validation errors on misconfigured vars
- Inspection surfaces: `http://localhost:3000` serves the app, browser devtools network tab shows API calls
- Failure visibility: `@t3-oss/env-nextjs` throws descriptive error listing missing/invalid vars at startup
- Redaction constraints: none — no secrets in this template app

## Integration Closure

- Upstream surfaces consumed: `@repo/api-client` (`createApiClient`), `@repo/shared` (`User`, `ApiResponse` types), `@repo/env` (re-exported `z`), `packages/typescript-config/nextjs.json`, `packages/eslint-config`
- New wiring introduced in this slice: `apps/nextjs/src/lib/api.ts` creates api-client instance, `QueryClientProvider` wraps app, demo page fetches via api-client
- What remains before the milestone is truly usable end-to-end: S06 (Expo app), S07 (docs + final polish)

## Tasks

- [x] **T01: Scaffold Next.js app with config, env, and ESLint** `est:45m`
  - Why: Foundation — the app needs package.json, tsconfig, next.config.ts, env validation, and ESLint before anything else can build on it
  - Files: `apps/nextjs/package.json`, `apps/nextjs/tsconfig.json`, `apps/nextjs/next.config.ts`, `apps/nextjs/src/env.ts`, `apps/nextjs/eslint.config.mjs`, `apps/nextjs/src/app/layout.tsx`, `apps/nextjs/src/app/page.tsx`, `apps/nextjs/.env.example`
  - Do: Create package.json with Next.js 16, React 19, workspace deps. tsconfig extending nextjs.json with `@/*` path alias. next.config.ts with `transpilePackages`. Env validation with `@t3-oss/env-nextjs`. ESLint extending shared config with React/Next.js plugins. Minimal layout.tsx and page.tsx (plain, no styling yet). Remove `.gitkeep`.
  - Verify: `pnpm install`, `pnpm build --filter nextjs`, `pnpm lint --filter nextjs`, `pnpm check-types --filter nextjs` all exit 0
  - Done when: Next.js app compiles, lints, and type-checks cleanly in the monorepo

- [x] **T02: Set up Tailwind CSS v4 + shadcn/ui components** `est:40m`
  - Why: Styling infrastructure — Tailwind v4 CSS-first setup and shadcn/ui component generation are the main risk in this slice (monorepo alias resolution)
  - Files: `apps/nextjs/src/app/globals.css`, `apps/nextjs/components.json`, `apps/nextjs/src/components/ui/button.tsx`, `apps/nextjs/src/components/ui/card.tsx`, `apps/nextjs/src/lib/utils.ts`, `apps/nextjs/postcss.config.mjs`
  - Do: Install `tailwindcss@4`, `@tailwindcss/postcss`. Create globals.css with `@import "tailwindcss"` and shadcn/ui CSS variables via `@theme`. Configure components.json with correct monorepo aliases (`@/components`, `@/lib/utils`). Add shadcn/ui components (Button, Card) — generate via CLI if it works, otherwise manually create from shadcn source. Wire globals.css import in layout.tsx. Verify PostCSS config.
  - Verify: `pnpm build --filter nextjs` passes, page renders with Tailwind styles visible
  - Done when: shadcn/ui Button and Card components render correctly with Tailwind v4 styling

- [x] **T03: TanStack Query + api-client integration + demo page** `est:40m`
  - Why: Closes the slice — proves the full integration chain from Next.js → api-client → Hono API with real data rendering
  - Files: `apps/nextjs/src/lib/api.ts`, `apps/nextjs/src/lib/query-client.ts`, `apps/nextjs/src/components/providers.tsx`, `apps/nextjs/src/app/layout.tsx`, `apps/nextjs/src/app/page.tsx`
  - Do: Install `@tanstack/react-query`. Create api-client instance in `lib/api.ts` using `createApiClient(env.NEXT_PUBLIC_API_URL)`. Create `getQueryClient()` module-scope singleton per TanStack SSR docs. Build `Providers` client component wrapping `QueryClientProvider`. Update layout.tsx to use Providers. Build demo page with `useQuery` fetching users from Hono API, rendering with Card components. Include loading/error states.
  - Verify: Start Hono API (`pnpm dev --filter honojs`), then `pnpm dev --filter nextjs`, curl localhost:3000 returns HTML with rendered content. `pnpm build --filter nextjs` still passes.
  - Done when: Demo page renders user data fetched from Hono API via api-client, with shadcn/ui Card components, loading state, and error handling

## Files Likely Touched

- `apps/nextjs/package.json`
- `apps/nextjs/tsconfig.json`
- `apps/nextjs/next.config.ts`
- `apps/nextjs/postcss.config.mjs`
- `apps/nextjs/components.json`
- `apps/nextjs/eslint.config.mjs`
- `apps/nextjs/.env.example`
- `apps/nextjs/src/env.ts`
- `apps/nextjs/src/app/layout.tsx`
- `apps/nextjs/src/app/page.tsx`
- `apps/nextjs/src/app/globals.css`
- `apps/nextjs/src/lib/utils.ts`
- `apps/nextjs/src/lib/api.ts`
- `apps/nextjs/src/lib/query-client.ts`
- `apps/nextjs/src/components/providers.tsx`
- `apps/nextjs/src/components/ui/button.tsx`
- `apps/nextjs/src/components/ui/card.tsx`
