# S06: Expo React Native App — Research

**Date:** 2026-03-13

## Summary

The Expo React Native app is the highest-risk slice in M001. The primary risk — pnpm monorepo compatibility — is largely retired by Expo SDK 55, which supports isolated pnpm dependencies natively (SDK 54+) and auto-configures Metro for monorepos (SDK 52+). No manual Metro config is needed. The current `.npmrc` does **not** have `node-linker=hoisted`, and we should keep it that way unless forced by build errors.

The app will use Expo Router (file-based routing), TanStack Query for data fetching, `@t3-oss/env-core` with `clientPrefix: "EXPO_PUBLIC_"` for env validation, and the existing `@repo/api-client` for typed API calls. The Expo app extends `expo/tsconfig.base` (not our custom typescript-config) because Expo's Metro bundler has specific expectations around `jsx: "react-native"` and `module: "preserve"`. Web output via `npx expo start --web` on port 8081 is the primary verification target.

React 19.2.4 in the monorepo is compatible with SDK 55 (which ships React 19.2). Node 24.14.0 is supported by SDK 55.

## Recommendation

Use Expo SDK 55 with Expo Router v7, `src/app` directory convention. Scaffold manually (not `create-expo-app`) to fit monorepo structure. Keep the app minimal: a single tab layout with a home screen that fetches users from the Hono API via `@repo/api-client` + TanStack Query — mirroring the Next.js app's data flow.

For the build step in turbo, use `npx expo export --platform web` (outputs to `dist/`). For dev, use `npx expo start --web`. For check-types, use `tsc --noEmit` with Expo's base tsconfig.

Do **not** add `node-linker=hoisted` to `.npmrc` preemptively. SDK 55 supports isolated deps. If a specific native package fails to resolve, document it and add hoisted as a last resort.

## Don't Hand-Roll

| Problem | Existing Solution | Why Use It |
|---------|------------------|------------|
| Env validation with EXPO_PUBLIC_ prefix | `@t3-oss/env-core` + `clientPrefix: "EXPO_PUBLIC_"` | Same pattern as Next.js app but with Expo prefix enforcement |
| Typed API client | `@repo/api-client` (`createApiClient`) | Already exists from S03 — reuse directly |
| File-based routing | `expo-router` | Ships with Expo SDK 55, standard approach |
| Data fetching + caching | `@tanstack/react-query` | Already used in Next.js app, works with React Native |
| Web bundling | Metro (built into Expo) | Auto-configured for monorepos since SDK 52 |

## Existing Code and Patterns

- `apps/nextjs/src/components/providers.tsx` — QueryClientProvider pattern; Expo app needs similar wrapper
- `apps/nextjs/src/lib/api.ts` — `createApiClient(env.NEXT_PUBLIC_API_URL)` pattern; Expo uses `env.EXPO_PUBLIC_API_URL`
- `apps/nextjs/src/lib/query-client.ts` — QueryClient singleton; Expo version is simpler (no SSR, always browser-like)
- `apps/nextjs/src/app/page.tsx` — User list with TanStack Query; port to React Native `<FlatList>` or `<View>`
- `apps/nextjs/src/env.ts` — Uses `@t3-oss/env-nextjs`; Expo uses `@t3-oss/env-core` with `clientPrefix`
- `packages/api-client/src/index.ts` — `createApiClient(baseUrl)` ready to use
- `packages/eslint-config/index.mjs` — Base config; Expo app adds `eslint-plugin-react-hooks` (same as Next.js)
- `apps/honojs/src/env.ts` — Server env pattern using `createEnv` from `@repo/env`
- `apps/nextjs/eslint.config.mjs` — React hooks plugin setup; Expo config is similar but without `@next/eslint-plugin-next`

## Constraints

- **Expo's tsconfig**: Must extend `expo/tsconfig.base`, not `@repo/typescript-config/react.json`. Expo's base sets `jsx: "react-native"`, `module: "preserve"`, `noEmit: true`, and `customConditions: ["react-native"]` — all required by Metro.
- **No `node-linker=hoisted`**: Current `.npmrc` uses default pnpm isolation. SDK 55 supports this. Adding hoisted would affect the entire monorepo and could mask dependency issues.
- **`EXPO_PUBLIC_` prefix**: Client-side env vars must use this prefix. Values are statically inlined by Metro at build time — `process.env.EXPO_PUBLIC_*` only (no destructuring, no bracket notation).
- **Port 8081**: Expo dev server defaults to 8081. No collision with Next.js (3000), Hono (3001), NestJS (3002).
- **React version alignment**: SDK 55 ships React 19.2. Monorepo has React 19.2.4. Must use `npx expo install` to get exact compatible versions of react, react-native, react-dom, react-native-web.
- **`src/app` directory**: SDK 55 convention puts routes in `src/app/`, not `app/`. Expo Router auto-detects this.
- **turbo `build` outputs**: `npx expo export --platform web` writes to `dist/` — matches turbo.json `outputs: ["dist/**"]`.
- **No shared UI components**: Per D003, no UI sharing between web and mobile. React Native uses its own `<View>`, `<Text>`, etc.

## Common Pitfalls

- **Fighting Expo's tsconfig** — Don't try to extend `@repo/typescript-config/react.json`. Expo's Metro bundler relies on specific compiler options (`jsx: "react-native"`, `module: "preserve"`). Use `expo/tsconfig.base` and add strict mode + path aliases on top.
- **Env vars not inlined** — `process.env.EXPO_PUBLIC_X` must be written exactly as dot notation. `const { EXPO_PUBLIC_X } = process.env` or `process.env['EXPO_PUBLIC_X']` will NOT be inlined by Metro.
- **Missing web dependencies** — Expo web requires `react-dom`, `react-native-web`, and `@expo/metro-runtime`. Must install with `npx expo install`.
- **React version mismatch** — If `react` version from pnpm catalog doesn't match what Expo SDK 55 expects, Metro may crash. Use `npx expo install` to pin compatible versions.
- **`node-linker=hoisted` as first resort** — Adding it fixes Expo but may break other packages' strict dependency expectations. Try isolated first; hoisted is the escape hatch.
- **No custom metro.config.js needed for SDK 52+** — The default `expo/metro-config` handles monorepo resolution automatically. Only create one if customization is actually needed (e.g., custom asset extensions).

## Open Risks

- **pnpm isolated deps with third-party RN packages**: While Expo core supports isolated deps since SDK 54, some React Native community packages may not resolve correctly. We're only using core Expo packages so risk is low, but `expo-network` (if added for TanStack Query online status) could be a test.
- **`expo export --platform web` as turbo build step**: This runs Metro bundler, which may try to resolve workspace packages differently than tsc. If shared packages aren't built first, export could fail. Turbo's `dependsOn: ["^build"]` should handle this, but needs verification.
- **React 19.2.4 vs Expo's pinned React 19.2.x**: Patch version difference. Should be fine, but `npx expo install` may want to pin a different patch. If it does, the Expo app's package.json pins its own React version (separate from pnpm catalog).
- **ESLint with React Native**: `eslint-plugin-react-hooks` works for RN, but we may want `eslint-plugin-react-native` for RN-specific rules. For a starter template, hooks plugin alone is sufficient.

## Skills Discovered

| Technology | Skill | Status |
|------------|-------|--------|
| Expo / React Native | `expo/skills@building-native-ui` | available (17.2K installs) — UI-focused, may be useful for screen design |
| Expo / React Native | `jezweb/claude-skills@react-native-expo` | available (744 installs) — general RN+Expo skill |
| Expo / React Native | `mindrally/skills@expo-react-native-typescript` | available (258 installs) — TS-focused |

## Sources

- Expo monorepo guide confirms SDK 52+ auto-configures Metro; pnpm supported with `pnpm-workspace.yaml` (source: [Expo Monorepos](https://docs.expo.dev/guides/monorepos))
- SDK 54+ supports isolated pnpm deps; `node-linker=hoisted` optional (source: [Expo Monorepos - Isolated Dependencies](https://docs.expo.dev/guides/monorepos))
- `create-expo-app` defaults to `node-linker=hoisted` for SDK < 54; SDK 55 supports isolated (source: [Expo create-expo-app](https://docs.expo.dev/more/create-expo))
- Expo env vars require `EXPO_PUBLIC_` prefix, statically inlined via `process.env` dot notation (source: [Expo Environment Variables](https://docs.expo.dev/guides/environment-variables))
- Expo web requires `react-dom`, `react-native-web`, `@expo/metro-runtime` (source: [Expo Web](https://docs.expo.dev/workflow/web))
- `@t3-oss/env-core` supports `clientPrefix` for non-Next.js frameworks (source: [T3 Env Core](https://env.t3.gg/docs/core))
- TanStack Query React Native setup: optional `onlineManager` with `expo-network` (source: [TanStack Query React Native](https://tanstack.com/query/v5/docs/framework/react/react-native))
- Expo tsconfig must extend `expo/tsconfig.base` with `jsx: "react-native"`, `module: "preserve"` (source: [Expo TypeScript](https://docs.expo.dev/guides/typescript))
- SDK 55 ships React 19.2, React Native 0.83; supports Node ^20.19.4, ^22.13.0, ^24.3.0, ^25.0.0 (source: [Expo SDK 55](https://docs.expo.dev/get-started/create-a-project))
