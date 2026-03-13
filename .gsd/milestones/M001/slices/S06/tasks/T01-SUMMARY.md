---
id: T01
parent: S06
milestone: M001
provides:
  - Expo SDK 55 app shell running in pnpm monorepo without node-linker=hoisted
  - Web build and dev server working via expo export/expo start
key_files:
  - apps/react-native/package.json
  - apps/react-native/app.json
  - apps/react-native/tsconfig.json
  - apps/react-native/eslint.config.mjs
  - apps/react-native/src/app/_layout.tsx
  - apps/react-native/src/app/index.tsx
key_decisions:
  - Pinned all Expo deps to SDK 55 ranges using `npx expo install --fix` for version alignment
  - expo-router is v55.0.5+ (not v5.x as initially expected — SDK 55 changed versioning scheme)
  - react/react-dom pinned to ^19.2.0 (Expo's requirement), resolves to monorepo's 19.2.4
  - react-native-web bumped to ~0.21.2 per Expo SDK 55 compatibility check
patterns_established:
  - Expo app extends expo/tsconfig.base (not @repo/typescript-config) per Metro requirements
  - ESLint config mirrors Next.js app pattern (base + react-hooks, ignoring .expo/ and dist/)
  - Build script uses `expo export --platform web` outputting to dist/ (turbo-compatible)
observability_surfaces:
  - none
duration: 15m
verification_result: passed
completed_at: 2026-03-13
blocker_discovered: false
---

# T01: Scaffold Expo app and verify it builds in the monorepo

**Expo SDK 55 app scaffolded in `apps/react-native/`, builds for web, type-checks, and lints — all without `node-linker=hoisted`.**

## What Happened

Created the Expo app shell with SDK 55 deps, Expo Router file-based routing in `src/app/`, and a minimal hello-world screen. Initial version ranges from the research doc were wrong (expo-linking was `~7.2.0` but SDK 55 uses `~55.0.0` — Expo changed their versioning to match the SDK). Used `npx expo install --fix` to get exact compatible versions for all native packages. This also bumped react-native-web from `~0.20.0` to `~0.21.2`, react-native-safe-area-context to `~5.6.2`, and react-native-screens to `~4.23.0`.

The primary risk — pnpm isolated deps with Expo SDK 55 — is fully retired. Metro resolves all dependencies correctly through pnpm's node_modules structure without `node-linker=hoisted`.

## Verification

- `pnpm install` — completed without errors
- `pnpm build --filter @repo/react-native` — exits 0, exported web bundle to `dist/` (728 modules, 1.1MB JS bundle)
- `pnpm lint --filter @repo/react-native` — exits 0
- `pnpm check-types --filter @repo/react-native` — exits 0
- Expo web dev server started on port 8081, browser showed hello screen with "ts-monorepo-starter", "Expo React Native App", "✓ App is running"
- Browser assertions: all 5/5 passed (text visible × 3, no console errors, no failed requests)
- `grep -c 'node-linker' .npmrc` — returns 0 (no hoisted mode added)

## Diagnostics

none

## Deviations

- Research doc had stale version ranges for several Expo packages (expo-router listed as `~4.0.0`, expo-linking as `~7.2.0`). SDK 55 changed to unified versioning (`~55.0.x`). Used `npx expo install --check/--fix` to resolve correct versions automatically.

## Known Issues

none

## Files Created/Modified

- `apps/react-native/package.json` — Expo SDK 55 workspace package with scripts and deps
- `apps/react-native/app.json` — Expo app config (name, slug, scheme, web output)
- `apps/react-native/tsconfig.json` — TypeScript config extending expo/tsconfig.base with strict mode
- `apps/react-native/eslint.config.mjs` — ESLint config with base + react-hooks plugin
- `apps/react-native/src/app/_layout.tsx` — Root layout with Slot
- `apps/react-native/src/app/index.tsx` — Hello world screen with View and Text
