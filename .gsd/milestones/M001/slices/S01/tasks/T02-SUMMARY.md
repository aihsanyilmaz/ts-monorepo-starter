---
id: T02
parent: S01
milestone: M001
provides:
  - "@repo/typescript-config package with base, node, react, nextjs JSON configs"
  - "@repo/eslint-config package exporting flat config array (ESLint 9 + typescript-eslint + prettier + turbo)"
  - "prettier installed as root devDependency"
key_files:
  - packages/typescript-config/base.json
  - packages/typescript-config/node.json
  - packages/typescript-config/react.json
  - packages/typescript-config/nextjs.json
  - packages/eslint-config/index.mjs
  - packages/eslint-config/eslint.config.mjs
key_decisions:
  - "eslint-config package has no check-types script — it's pure JS config, no TS to type-check"
  - "eslint-plugin-turbo flat/recommended exports a single config object (not an array), don't spread it"
  - "prettier added as root devDependency (was in catalog but not installed by T01)"
  - ".prettierignore updated to exclude .gsd and .bg-shell directories"
patterns_established:
  - "Shared eslint config consumed via eslint.config.mjs importing from @repo/eslint-config"
  - "TypeScript configs consumed via extends: @repo/typescript-config/<variant>.json"
observability_surfaces:
  - none
duration: ~10m
verification_result: passed
completed_at: 2026-03-13
blocker_discovered: false
---

# T02: Create shared TypeScript and ESLint config packages

**Created `@repo/typescript-config` (4 JSON configs) and `@repo/eslint-config` (flat config with typescript-eslint, prettier, turbo), all pipeline checks passing.**

## What Happened

Created `packages/typescript-config/` with four configs: `base.json` (strict TS, bundler moduleResolution, ES2022), `node.json` (NodeNext module/resolution), `react.json` (JSX preserve, DOM libs), `nextjs.json` (extends react, adds Next.js plugin, allowJs, noEmit).

Created `packages/eslint-config/` with `index.mjs` exporting a flat config array via `tseslint.config()` — includes eslint recommended, typescript-eslint recommended, eslint-config-prettier, and eslint-plugin-turbo flat/recommended. Added `eslint.config.mjs` that re-exports the shared config so the package self-lints.

Added `prettier` as root devDependency (was defined in catalog but never installed). Updated `.prettierignore` to exclude `.gsd/` and `.bg-shell/`. Ran prettier --write to fix formatting across all project files.

## Verification

- `pnpm install` — exits 0, 3 workspace projects resolved (root + 2 config packages)
- `pnpm lint` — exits 0, eslint-config package self-lints clean
- `pnpm check-types` — exits 0 (no packages have TS source yet, expected)
- `pnpm exec prettier --check .` — exits 0, all files formatted

**Slice-level verification status:**
- ✅ `pnpm install` exits 0 with all workspaces resolved
- ✅ `pnpm lint` exits 0
- ✅ `pnpm check-types` exits 0
- ✅ `pnpm exec prettier --check .` exits 0
- ⬜ `turbo build` exits 0 — not tested (no build targets yet, will pass vacuously)

## Diagnostics

None — static config packages with no runtime behavior.

## Deviations

- Task plan suggested adding a `tsconfig.json` to eslint-config for `check-types`. Skipped because the package is pure JS (`.mjs`) — tsc with checkJs flagged type-level incompatibilities in third-party plugin types that aren't meaningful to fix. No `check-types` script on this package is the correct choice.
- `prettier` was not installed by T01 despite being in the catalog and having format scripts. Added it as root devDependency here.
- `.prettierignore` updated to exclude `.gsd/` and `.bg-shell/` directories to avoid formatting GSD artifacts.

## Known Issues

None.

## Files Created/Modified

- `packages/typescript-config/package.json` — workspace package metadata for @repo/typescript-config
- `packages/typescript-config/base.json` — strict base TypeScript config
- `packages/typescript-config/node.json` — Node.js TypeScript config (extends base)
- `packages/typescript-config/react.json` — React TypeScript config (extends base)
- `packages/typescript-config/nextjs.json` — Next.js TypeScript config (extends react)
- `packages/eslint-config/package.json` — workspace package with eslint dependencies from catalog
- `packages/eslint-config/index.mjs` — flat config export with eslint, typescript-eslint, prettier, turbo
- `packages/eslint-config/eslint.config.mjs` — self-lint config re-exporting shared config
- `package.json` — added prettier as root devDependency
- `.prettierignore` — added .gsd and .bg-shell exclusions
