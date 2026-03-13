---
id: T02
parent: S06
milestone: M001
provides:
  - Full shared-package integration chain in Expo app: env validation → typed API client → TanStack Query → user list screen
  - Expo env validation with EXPO_PUBLIC_ prefix via @t3-oss/env-core
  - User list screen with loading, error, empty, and populated states
key_files:
  - apps/react-native/src/env.ts
  - apps/react-native/src/lib/api.ts
  - apps/react-native/src/lib/query-client.ts
  - apps/react-native/src/components/providers.tsx
  - apps/react-native/src/app/index.tsx
key_decisions:
  - Used catalog: for @t3-oss/env-core to match monorepo-wide version (0.13.10) and avoid zod peer dep mismatch
  - Simplified QueryClient singleton for RN (no SSR branching needed, just module-scope instance)
patterns_established:
  - Expo env validation mirrors Next.js pattern but uses clientPrefix EXPO_PUBLIC_ and runtimeEnv mapping with process.env
  - API client and query client modules follow same structure as Next.js app for consistency
observability_surfaces:
  - Error state on user list screen surfaces API fetch failures with message
  - Loading spinner visible during data fetch
duration: ~10min
verification_result: passed
completed_at: 2026-03-13
blocker_discovered: false
---

# T02: Wire shared packages, env validation, and user list screen

**Wired @repo/env, @repo/api-client, @repo/shared, and TanStack Query into the Expo app with a user list screen that fetches real data from the Hono API.**

## What Happened

Added workspace dependencies (@repo/env, @repo/shared, @repo/api-client, @t3-oss/env-core, @tanstack/react-query) to the Expo app. Created env validation with EXPO_PUBLIC_API_URL, typed API client, QueryClient singleton, and Providers wrapper — all mirroring the Next.js app patterns adapted for React Native (no SSR, no 'use client', RN primitives instead of shadcn).

Built the user list screen with all four states (loading/error/empty/populated) using FlatList, ActivityIndicator, and basic RN Views. The screen fetches users from the Hono API via the shared typed client.

## Verification

- `pnpm check-types --filter @repo/react-native` — exits 0 ✓
- `pnpm lint --filter @repo/react-native` — exits 0 ✓
- `pnpm build --filter @repo/react-native` — exits 0 (expo export --platform web) ✓
- Started Hono API (port 3001) + Expo web (port 8081), loaded http://localhost:8081 — user list rendered with seeded user data ("test" / "test@example.com") ✓
- Browser assertions passed: "Users" heading, subtitle text, and user email visible ✓
- No `node-linker=hoisted` in .npmrc ✓

## Diagnostics

- Error state renders API error messages directly on screen
- Expo build logs show `.env` loading: `env: load .env` / `env: export EXPO_PUBLIC_API_URL`

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `apps/react-native/package.json` — added shared package dependencies
- `apps/react-native/src/env.ts` — env validation with EXPO_PUBLIC_API_URL
- `apps/react-native/src/lib/api.ts` — typed Hono RPC client instance
- `apps/react-native/src/lib/query-client.ts` — QueryClient singleton
- `apps/react-native/src/components/providers.tsx` — QueryClientProvider wrapper
- `apps/react-native/src/app/_layout.tsx` — updated to wrap Slot with Providers
- `apps/react-native/src/app/index.tsx` — user list screen with all states
- `apps/react-native/.env` — EXPO_PUBLIC_API_URL=http://localhost:3001
- `apps/react-native/.env.example` — documented env template
