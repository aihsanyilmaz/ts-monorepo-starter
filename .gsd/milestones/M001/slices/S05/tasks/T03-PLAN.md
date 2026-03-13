---
estimated_steps: 5
estimated_files: 6
---

# T03: TanStack Query + api-client integration + demo page

**Slice:** S05 — Next.js Web App
**Milestone:** M001

## Description

Wire up TanStack Query v5 with the App Router `QueryClientProvider` pattern, create an api-client instance using `@repo/api-client`, and build a demo page that fetches users from the Hono API and renders them with shadcn/ui Card components. This task closes the slice by proving the full integration chain: Next.js → TanStack Query → api-client → Hono API → rendered UI.

## Steps

1. Install `@tanstack/react-query`. Create `apps/nextjs/src/lib/query-client.ts` with the module-scope `getQueryClient()` singleton pattern from TanStack Query SSR docs (browser: reuse single instance; server: new instance per request using `isServer` check).

2. Create `apps/nextjs/src/lib/api.ts` that imports `createApiClient` from `@repo/api-client` and `env` from `@/env`, exports an `apiClient` instance created with `env.NEXT_PUBLIC_API_URL`. This is the single entry point for API calls.

3. Create `apps/nextjs/src/components/providers.tsx` as a `'use client'` component that wraps children with `QueryClientProvider` using `getQueryClient()`. Update `apps/nextjs/src/app/layout.tsx` to wrap the app with `<Providers>`.

4. Build the demo page in `apps/nextjs/src/app/page.tsx`:
   - `'use client'` directive (uses `useQuery` hook)
   - `useQuery` fetching users from `apiClient.api.users.$get()` (matching Hono route structure)
   - Render users in shadcn Card components (CardHeader with name, CardContent with email)
   - Loading state with a spinner or "Loading..." text
   - Error state displaying the error message
   - Empty state when no users exist
   - Import and use `User` type from `@repo/shared` for type safety

5. Verify full integration: start Hono API with `pnpm dev --filter honojs`, then start Next.js with `pnpm dev --filter nextjs`. Curl `http://localhost:3000` to confirm HTML response. Run `pnpm build --filter nextjs` to confirm production build passes. Run `pnpm lint --filter nextjs` and `pnpm check-types --filter nextjs`.

## Must-Haves

- [ ] `getQueryClient()` uses module-scope singleton pattern (not useState)
- [ ] `Providers` component is `'use client'` and wraps `QueryClientProvider`
- [ ] `api.ts` creates typed api-client instance using env-validated URL
- [ ] Demo page fetches users via `@repo/api-client` typed RPC call
- [ ] Demo page renders with shadcn/ui Card components
- [ ] Demo page has loading, error, and empty states
- [ ] `pnpm build --filter nextjs` passes
- [ ] `pnpm dev --filter nextjs` serves the page on localhost:3000

## Verification

- `pnpm build --filter nextjs` exits 0
- `pnpm check-types --filter nextjs` exits 0
- `pnpm lint --filter nextjs` exits 0
- With Hono API running: `curl http://localhost:3000` returns HTML containing expected page content
- `pnpm dev --filter nextjs` starts without errors on port 3000

## Observability Impact

- Signals added/changed: TanStack Query's built-in error/loading states expose fetch failures in UI; env validation at import time surfaces missing `NEXT_PUBLIC_API_URL`
- How a future agent inspects this: browser devtools network tab shows API calls to Hono; React Query Devtools can be added later for cache inspection
- Failure state exposed: missing env var → startup crash with descriptive t3-env error; API unreachable → error state rendered in UI with message

## Inputs

- T02 output — working Next.js app with Tailwind v4 and shadcn/ui Button + Card components
- `packages/api-client/src/index.ts` — `createApiClient(baseUrl)` function
- `apps/honojs/src/routes/users.ts` — Hono route structure for users endpoint (GET `/api/users`)
- `packages/shared/src/schemas/user.ts` — `User` type for type-safe rendering

## Expected Output

- `apps/nextjs/src/lib/query-client.ts` — getQueryClient singleton
- `apps/nextjs/src/lib/api.ts` — typed api-client instance
- `apps/nextjs/src/components/providers.tsx` — QueryClientProvider wrapper
- `apps/nextjs/src/app/layout.tsx` — updated with Providers wrapper
- `apps/nextjs/src/app/page.tsx` — demo page with users list, loading/error states, shadcn Cards
