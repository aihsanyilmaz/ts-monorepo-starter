---
id: T03
parent: S05
milestone: M001
provides:
  - TanStack Query v5 with QueryClientProvider and module-scope getQueryClient singleton
  - Typed api-client instance (apiClient) via @repo/api-client connected to env-validated NEXT_PUBLIC_API_URL
  - Demo page fetching and rendering users from Hono API with shadcn/ui Card components
  - Loading, error, and empty states on the demo page
  - CORS middleware on Hono API enabling cross-origin requests from Next.js
key_files:
  - apps/nextjs/src/lib/query-client.ts
  - apps/nextjs/src/lib/api.ts
  - apps/nextjs/src/components/providers.tsx
  - apps/nextjs/src/app/layout.tsx
  - apps/nextjs/src/app/page.tsx
  - apps/honojs/src/index.ts
key_decisions:
  - Added hono/cors middleware to Hono API (permissive in dev) to allow cross-origin fetch from Next.js at localhost:3000
  - Used inline UsersResponse type in page.tsx rather than importing ApiResponse from @repo/shared to avoid generic type gymnastics with hono client's json() return
patterns_established:
  - TanStack Query SSR pattern — module-scope singleton via isServer check, not useState
  - Api-client singleton in lib/api.ts — single entry point for all API calls
  - Providers component wrapping QueryClientProvider as 'use client' boundary
observability_surfaces:
  - TanStack Query loading/error states expose fetch failures directly in UI
  - Missing NEXT_PUBLIC_API_URL → t3-env startup crash with descriptive error
  - API unreachable → error state rendered in UI with message text
  - Browser network tab shows fetch to localhost:3001/api/users
duration: ~15m
verification_result: passed
completed_at: 2026-03-13
blocker_discovered: false
---

# T03: TanStack Query + api-client integration + demo page

**Wired TanStack Query v5 with typed api-client to fetch users from Hono API and render them in shadcn/ui Cards — full integration chain proven end-to-end.**

## What Happened

Installed `@tanstack/react-query`. Created `getQueryClient()` singleton using the TanStack-recommended `isServer` check pattern — server gets a fresh instance per request, browser reuses one. Created `apiClient` in `lib/api.ts` importing `createApiClient` from `@repo/api-client` with the env-validated URL.

Built a `Providers` client component wrapping `QueryClientProvider` and added it to the root layout. The demo page uses `useQuery` to fetch users via `apiClient.api.users.$get()` (Hono RPC typed call), renders them in shadcn Card components with name in CardHeader and email in CardContent. Handles loading (spinner), error (red alert), and empty (instructional message) states.

Hit a CORS issue on first browser test — Hono API at :3001 had no CORS headers for the Next.js origin at :3000. Added `hono/cors` middleware (permissive `cors()` for dev). After restart, the full chain worked: Next.js → TanStack Query → api-client → Hono API → rendered user cards.

## Verification

All slice-level checks pass:
- `pnpm build --filter @repo/nextjs` — exits 0 (compiled + static pages generated)
- `pnpm lint --filter @repo/nextjs` — exits 0
- `pnpm check-types --filter @repo/nextjs` — exits 0
- `pnpm dev --filter @repo/nextjs` starts on port 3000
- `curl http://localhost:3000` returns HTML containing page content (Users heading, loading state in SSR)
- Browser verification: page renders shadcn/ui Card with user name and email, no console errors, no failed network requests
- `pnpm build --filter @repo/honojs` — exits 0 (CORS change doesn't break Hono build)

## Diagnostics

- **Inspect API calls:** Browser devtools Network tab shows GET to `http://localhost:3001/api/users`
- **Missing env var:** Remove `NEXT_PUBLIC_API_URL` from `.env` → t3-env throws descriptive error at startup listing the missing variable
- **API down:** Stop Hono server → demo page renders error state with "Failed to fetch" message
- **Empty state:** Delete all users from DB → demo page shows "No users yet" with POST instruction

## Deviations

- Added `hono/cors` middleware to `apps/honojs/src/index.ts` — not in the task plan but required for cross-origin browser fetch. This is a necessary integration fix, not a scope change.

## Known Issues

- CORS is permissive (`cors()` with defaults = allow all origins). Should be tightened for production with explicit origin list. Acceptable for a dev template.

## Files Created/Modified

- `apps/nextjs/src/lib/query-client.ts` — TanStack Query getQueryClient singleton (isServer pattern)
- `apps/nextjs/src/lib/api.ts` — typed api-client instance using env-validated URL
- `apps/nextjs/src/components/providers.tsx` — 'use client' QueryClientProvider wrapper
- `apps/nextjs/src/app/layout.tsx` — updated to wrap children with Providers
- `apps/nextjs/src/app/page.tsx` — demo page with useQuery, shadcn Cards, loading/error/empty states
- `apps/nextjs/package.json` — added @tanstack/react-query dependency
- `apps/honojs/src/index.ts` — added hono/cors middleware for cross-origin requests
