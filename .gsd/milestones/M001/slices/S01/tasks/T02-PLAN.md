---
estimated_steps: 4
estimated_files: 8
---

# T02: Create shared TypeScript and ESLint config packages

**Slice:** S01 — Monorepo Altyapısı
**Milestone:** M001

## Description

Create `@repo/typescript-config` and `@repo/eslint-config` workspace packages. TypeScript config exports base/node/react/nextjs JSON configs. ESLint config exports a flat config array using typescript-eslint and eslint-config-prettier. Then run `pnpm install` and verify the full Turbo pipeline (`lint`, `check-types`) passes.

## Steps

1. Create `packages/typescript-config/`:
   - `package.json`: name `@repo/typescript-config`, private, no build script, `"files": ["*.json"]`
   - `base.json`: strict TypeScript settings — `strict: true`, `esModuleInterop: true`, `skipLibCheck: true`, `forceConsistentCasingInFileNames: true`, `moduleResolution: "bundler"`, `module: "ESNext"`, `target: "ES2022"`, `resolveJsonModule: true`, `isolatedModules: true`, `declaration: true`, `declarationMap: true`, `sourceMap: true`
   - `node.json`: extends `./base.json`, sets `module: "NodeNext"`, `moduleResolution: "NodeNext"`, `target: "ES2022"`
   - `react.json`: extends `./base.json`, adds `"jsx": "preserve"`, `lib: ["ES2022", "DOM", "DOM.Iterable"]`
   - `nextjs.json`: extends `./react.json`, adds Next.js plugin paths, `allowJs: true`, `noEmit: true`

2. Create `packages/eslint-config/`:
   - `package.json`: name `@repo/eslint-config`, private, `"type": "module"`, `"main": "./index.mjs"`, `"exports": { ".": "./index.mjs" }`
   - Dependencies: `@eslint/js`, `typescript-eslint`, `eslint-config-prettier`, `eslint-plugin-turbo` (all using `catalog:`)
   - devDependencies: `eslint`, `typescript` (using `catalog:`)
   - `index.mjs`: export a base config array using `tseslint.config()` — includes `eslint.configs.recommended`, `tseslint.configs.recommended`, `eslintConfigPrettier`, `turboPlugin.configs["flat/recommended"]`, plus ignores for common patterns (dist, node_modules, .next, .turbo)
   - Add `eslint.config.mjs` to the eslint-config package so it self-lints via the exported config

3. Add a minimal `tsconfig.json` and `eslint.config.mjs` to the `eslint-config` package so `check-types` and `lint` have something to run on. The typescript-config package has no TS source, so it just needs to be a valid workspace package.

4. Run `pnpm install`, then verify:
   - `pnpm lint` exits 0
   - `pnpm check-types` exits 0
   - `pnpm format --check` exits 0 (or `pnpm exec prettier --check .`)
   - Fix any issues found until all pass clean

## Must-Haves

- [ ] `@repo/typescript-config` exports four JSON configs (base, node, react, nextjs)
- [ ] `@repo/eslint-config` exports flat config array with typescript-eslint + prettier + turbo
- [ ] `pnpm install` resolves all workspaces without errors
- [ ] `pnpm lint` exits 0
- [ ] `pnpm check-types` exits 0

## Verification

- `pnpm install` — exits 0, no workspace resolution errors
- `pnpm lint` — exits 0
- `pnpm check-types` — exits 0
- `pnpm exec prettier --check .` — exits 0 (or fix formatting)

## Inputs

- `package.json` — root workspace with Turbo scripts (from T01)
- `pnpm-workspace.yaml` — workspace globs and version catalog (from T01)
- `turbo.json` — task pipeline (from T01)
- S01-RESEARCH.md — ESLint 9 constraint, version matrix, flat config patterns

## Expected Output

- `packages/typescript-config/package.json` — workspace package metadata
- `packages/typescript-config/base.json` — strict base TypeScript config
- `packages/typescript-config/node.json` — Node.js TypeScript config
- `packages/typescript-config/react.json` — React TypeScript config
- `packages/typescript-config/nextjs.json` — Next.js TypeScript config
- `packages/eslint-config/package.json` — workspace package with eslint dependencies
- `packages/eslint-config/index.mjs` — flat config export
- `packages/eslint-config/eslint.config.mjs` — self-lint config
