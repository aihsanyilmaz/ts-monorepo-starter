# S06: Expo React Native App

**Goal:** `apps/react-native` is a working Expo app in the pnpm monorepo that uses shared packages (`@repo/env`, `@repo/shared`, `@repo/api-client`) and TanStack Query to fetch and display users from the Hono API.
**Demo:** `pnpm dev --filter @repo/react-native` starts Expo web on port 8081; browser shows a user list screen fetching from the Hono API.

## Must-Haves

- Expo SDK 55 app with Expo Router file-based routing in `src/app/`
- Extends `expo/tsconfig.base` (not `@repo/typescript-config`)
- Env validation via `@t3-oss/env-core` with `EXPO_PUBLIC_` prefix
- TanStack Query + `@repo/api-client` fetching users from Hono API
- `pnpm build --filter @repo/react-native` runs `expo export --platform web`
- `pnpm lint --filter @repo/react-native` and `pnpm check-types --filter @repo/react-native` pass
- No `node-linker=hoisted` added to `.npmrc`

## Proof Level

- This slice proves: operational (Expo app runs in monorepo and consumes shared packages)
- Real runtime required: yes (Expo web dev server + Hono API must serve)
- Human/UAT required: no (browser verification of web output is sufficient)

## Verification

- `pnpm build --filter @repo/react-native` exits 0
- `pnpm lint --filter @repo/react-native` exits 0
- `pnpm check-types --filter @repo/react-native` exits 0
- Start Expo web dev server, verify page loads at `http://localhost:8081` with user list content
- Confirm no `node-linker=hoisted` in `.npmrc`

## Integration Closure

- Upstream surfaces consumed: `packages/env` (`createEnv`, `z`), `packages/shared` (`User` type), `packages/api-client` (`createApiClient`)
- New wiring introduced in this slice: Expo app's `env.ts` → api client → TanStack Query → user list screen
- What remains before the milestone is truly usable end-to-end: S07 (documentation and final polish)

## Tasks

- [x] **T01: Scaffold Expo app and verify it builds in the monorepo** `est:45m`
  - Why: Retires the highest risk (pnpm + Expo compatibility) before wiring shared packages. Gets a minimal "Hello World" Expo web app running.
  - Files: `apps/react-native/package.json`, `apps/react-native/app.json`, `apps/react-native/tsconfig.json`, `apps/react-native/src/app/_layout.tsx`, `apps/react-native/src/app/index.tsx`, `apps/react-native/eslint.config.mjs`
  - Do: Create package.json with Expo SDK 55 deps (use `npx expo install` for version-compatible react/react-native/react-dom/react-native-web). Set up app.json, tsconfig extending `expo/tsconfig.base`, Expo Router entry point with a basic layout and hello-world index screen. Add eslint config (base + react-hooks). No shared package imports yet.
  - Verify: `pnpm install` succeeds, `pnpm build --filter @repo/react-native` exits 0, `pnpm lint --filter @repo/react-native` exits 0, `pnpm check-types --filter @repo/react-native` exits 0, Expo web dev server starts and shows the hello screen.
  - Done when: Expo app compiles, builds for web, and renders a screen in the browser — proving monorepo compatibility without `node-linker=hoisted`.

- [x] **T02: Wire shared packages, env validation, and user list screen** `est:45m`
  - Why: Integrates the Expo app with the monorepo's shared infrastructure and delivers the demo — a user list screen matching the Next.js app's data flow pattern.
  - Files: `apps/react-native/src/env.ts`, `apps/react-native/src/lib/api.ts`, `apps/react-native/src/lib/query-client.ts`, `apps/react-native/src/components/providers.tsx`, `apps/react-native/src/app/_layout.tsx`, `apps/react-native/src/app/index.tsx`, `apps/react-native/.env`, `apps/react-native/.env.example`, `apps/react-native/package.json`
  - Do: Add `@repo/env`, `@repo/shared`, `@repo/api-client`, `@t3-oss/env-core`, `@tanstack/react-query` as deps. Create `env.ts` with `createEnv` using `clientPrefix: "EXPO_PUBLIC_"` and `EXPO_PUBLIC_API_URL`. Create `api.ts` and `query-client.ts` mirroring Next.js patterns. Build `Providers` wrapper with QueryClientProvider. Update layout to use Providers. Build user list screen with FlatList/View fetching users via TanStack Query.
  - Verify: `pnpm build --filter @repo/react-native` exits 0, `pnpm check-types --filter @repo/react-native` exits 0, start both Hono API and Expo web server — user list screen loads at localhost:8081 and displays users from the API.
  - Done when: Expo web shows user list fetched from Hono API via `@repo/api-client` + TanStack Query, all lint/type-check/build commands pass.

## Files Likely Touched

- `apps/react-native/package.json`
- `apps/react-native/app.json`
- `apps/react-native/tsconfig.json`
- `apps/react-native/eslint.config.mjs`
- `apps/react-native/.env`
- `apps/react-native/.env.example`
- `apps/react-native/src/app/_layout.tsx`
- `apps/react-native/src/app/index.tsx`
- `apps/react-native/src/env.ts`
- `apps/react-native/src/lib/api.ts`
- `apps/react-native/src/lib/query-client.ts`
- `apps/react-native/src/components/providers.tsx`
