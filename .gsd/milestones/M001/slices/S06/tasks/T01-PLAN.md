---
estimated_steps: 5
estimated_files: 8
---

# T01: Scaffold Expo app and verify it builds in the monorepo

**Slice:** S06 — Expo React Native App
**Milestone:** M001

## Description

Create the Expo SDK 55 app shell in `apps/react-native/` and prove it builds, lints, type-checks, and runs on web inside the pnpm monorepo — without adding `node-linker=hoisted`. This retires the primary risk of the slice before any shared package integration.

## Steps

1. **Create `apps/react-native/package.json`** with name `@repo/react-native`, Expo SDK 55 core deps (`expo`, `expo-router`, `expo-status-bar`, `react`, `react-dom`, `react-native`, `react-native-web`, `@expo/metro-runtime`, `react-native-safe-area-context`, `react-native-screens`, `expo-linking`, `expo-constants`), scripts (`dev`, `build`, `lint`, `check-types`), and devDependencies (`@repo/eslint-config`, `typescript`, `eslint`, `eslint-plugin-react-hooks`). Use `npx expo install` to pin version-compatible React/RN packages if needed.

2. **Create `apps/react-native/app.json`** with Expo config: name, slug, scheme, web output dir `dist`, `bundler: "metro"`, entry point pointing to `expo-router/entry`.

3. **Create `apps/react-native/tsconfig.json`** extending `expo/tsconfig.base` with strict mode, `src/app` include, path aliases (`@/*` → `./src/*`).

4. **Create minimal Expo Router layout and screen:**
   - `src/app/_layout.tsx` — root layout with `<Slot />` (simplest possible layout)
   - `src/app/index.tsx` — hello world screen with `<View>` and `<Text>` confirming the app works

5. **Create `apps/react-native/eslint.config.mjs`** mirroring Next.js pattern: spread base config + react-hooks plugin, ignore `.expo/` and `dist/`.

6. **Run `pnpm install`**, then verify: `pnpm build --filter @repo/react-native`, `pnpm lint --filter @repo/react-native`, `pnpm check-types --filter @repo/react-native` all exit 0. Start Expo web dev server and confirm it renders in the browser.

## Must-Haves

- [ ] `apps/react-native/package.json` with Expo SDK 55 deps and workspace scripts
- [ ] `apps/react-native/app.json` with Expo config for web output
- [ ] `apps/react-native/tsconfig.json` extending `expo/tsconfig.base`
- [ ] Expo Router `_layout.tsx` + `index.tsx` rendering a hello screen
- [ ] ESLint config with base + react-hooks
- [ ] `pnpm build --filter @repo/react-native` exits 0
- [ ] `pnpm lint --filter @repo/react-native` exits 0
- [ ] `pnpm check-types --filter @repo/react-native` exits 0
- [ ] No `node-linker=hoisted` added to `.npmrc`

## Verification

- `pnpm install` completes without errors
- `pnpm build --filter @repo/react-native` exits 0 (web export to `dist/`)
- `pnpm lint --filter @repo/react-native` exits 0
- `pnpm check-types --filter @repo/react-native` exits 0
- Expo web dev server starts and page loads in browser showing hello screen
- `grep -c 'node-linker' .npmrc` returns 0

## Inputs

- `pnpm-workspace.yaml` — workspace already includes `apps/*`
- `turbo.json` — build/dev/lint/check-types tasks defined
- `packages/eslint-config/index.mjs` — base ESLint config to extend
- `.npmrc` — current config without `node-linker=hoisted`
- S06-RESEARCH.md — Expo SDK 55 compatibility findings, tsconfig constraints, pitfalls

## Expected Output

- `apps/react-native/package.json` — Expo SDK 55 workspace package
- `apps/react-native/app.json` — Expo app config
- `apps/react-native/tsconfig.json` — TypeScript config extending expo base
- `apps/react-native/eslint.config.mjs` — ESLint config
- `apps/react-native/src/app/_layout.tsx` — root layout
- `apps/react-native/src/app/index.tsx` — hello world screen
- All build/lint/check-types commands passing
