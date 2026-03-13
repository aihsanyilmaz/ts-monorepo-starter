---
estimated_steps: 5
estimated_files: 8
---

# T02: Wire shared packages, env validation, and user list screen

**Slice:** S06 — Expo React Native App
**Milestone:** M001

## Description

Integrate the Expo app with the monorepo's shared infrastructure: env validation via `@t3-oss/env-core` with `EXPO_PUBLIC_` prefix, typed API client from `@repo/api-client`, and TanStack Query for data fetching. Build a user list screen that mirrors the Next.js app's data flow — proving the full shared-package integration chain works in React Native.

## Steps

1. **Add shared package dependencies** to `apps/react-native/package.json`: `@repo/env`, `@repo/shared`, `@repo/api-client`, `@t3-oss/env-core`, `@tanstack/react-query`. Run `pnpm install`.

2. **Create env, api client, and query client modules:**
   - `src/env.ts` — `createEnv` from `@repo/env` with `clientPrefix: "EXPO_PUBLIC_"`, `client: { EXPO_PUBLIC_API_URL: z.string().url() }`, explicit `runtimeEnv` mapping using `process.env.EXPO_PUBLIC_API_URL`
   - `src/lib/api.ts` — `createApiClient(env.EXPO_PUBLIC_API_URL)` from `@repo/api-client`
   - `src/lib/query-client.ts` — simple `QueryClient` singleton (no SSR concerns)
   - `.env` and `.env.example` with `EXPO_PUBLIC_API_URL=http://localhost:3001`

3. **Create Providers component** at `src/components/providers.tsx` — wraps children in `QueryClientProvider`.

4. **Update layout and build user list screen:**
   - Update `src/app/_layout.tsx` to wrap `<Slot />` with `<Providers>`
   - Rewrite `src/app/index.tsx` as a user list screen: `useQuery` fetching users via `apiClient.api.users.$get()`, displaying in a `<View>` with loading/error/empty/list states using React Native primitives (`<Text>`, `<View>`, `<ActivityIndicator>`, `<FlatList>`)

5. **Verify full integration:** `pnpm build`, `pnpm lint`, `pnpm check-types` all pass for the react-native filter. Start Hono API + Expo web server, load `http://localhost:8081` in browser, confirm user list renders (or shows empty state if no users seeded).

## Must-Haves

- [ ] `@t3-oss/env-core` env validation with `EXPO_PUBLIC_API_URL`
- [ ] `@repo/api-client` creating typed client from env-validated URL
- [ ] TanStack Query `QueryClientProvider` wrapping the app
- [ ] User list screen with loading, error, empty, and populated states
- [ ] `.env` and `.env.example` with `EXPO_PUBLIC_API_URL`
- [ ] `pnpm build --filter @repo/react-native` exits 0
- [ ] `pnpm check-types --filter @repo/react-native` exits 0

## Verification

- `pnpm build --filter @repo/react-native` exits 0
- `pnpm lint --filter @repo/react-native` exits 0
- `pnpm check-types --filter @repo/react-native` exits 0
- Start Hono API (`pnpm dev --filter @repo/honojs`) and Expo web (`pnpm dev --filter @repo/react-native`), load `http://localhost:8081` — user list screen renders
- Shared type imports (`User` from `@repo/shared`) compile without errors

## Inputs

- T01 output: working Expo app shell with hello screen
- `apps/nextjs/src/env.ts` — env pattern to adapt for Expo
- `apps/nextjs/src/lib/api.ts` — api client pattern to mirror
- `apps/nextjs/src/lib/query-client.ts` — query client pattern (simplified for RN)
- `apps/nextjs/src/components/providers.tsx` — providers pattern to mirror
- `apps/nextjs/src/app/page.tsx` — user list UI to port to React Native primitives
- `packages/api-client/src/index.ts` — `createApiClient` function
- `packages/env/src/index.ts` — `createEnv` and `z` re-exports

## Expected Output

- `apps/react-native/src/env.ts` — Expo env validation
- `apps/react-native/src/lib/api.ts` — typed API client instance
- `apps/react-native/src/lib/query-client.ts` — QueryClient singleton
- `apps/react-native/src/components/providers.tsx` — QueryClientProvider wrapper
- `apps/react-native/src/app/_layout.tsx` — updated with Providers
- `apps/react-native/src/app/index.tsx` — user list screen with all states
- `apps/react-native/.env` — env file with API URL
- `apps/react-native/.env.example` — documented env template
- Full shared package integration chain working: env → api-client → TanStack Query → screen
