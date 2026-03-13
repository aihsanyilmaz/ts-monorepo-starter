# S01: Monorepo Altyapısı

**Goal:** Fully wired pnpm + Turborepo monorepo with shared TypeScript and ESLint configs, ready for app/package development in subsequent slices.
**Demo:** `pnpm install` resolves all workspaces, `pnpm lint` and `pnpm check-types` pass clean across the workspace.

## Must-Haves

- Root `package.json` with workspace scripts (`dev`, `build`, `lint`, `check-types`, `format`)
- `pnpm-workspace.yaml` with `apps/*` + `packages/*` globs and version catalog
- `turbo.json` with correct task pipeline (build, dev, lint, check-types, format)
- `@repo/typescript-config` package exporting `base.json`, `node.json`, `react.json`, `nextjs.json`
- `@repo/eslint-config` package with ESLint 9 flat config using typescript-eslint
- Root `.prettierrc`, `.prettierignore`, `.npmrc`, updated `.gitignore`
- Placeholder directories for all four apps (`apps/honojs`, `apps/nestjs`, `apps/nextjs`, `apps/react-native`)

## Verification

- `pnpm install` exits 0 with all workspaces resolved
- `pnpm lint` exits 0 (runs across workspace via Turbo)
- `pnpm check-types` exits 0 (runs across workspace via Turbo)
- `pnpm format --check` exits 0 (Prettier check mode)
- `turbo build` exits 0 (no build targets yet, but pipeline validates)

## Tasks

- [x] **T01: Scaffold root workspace and Turbo pipeline** `est:30m`
  - Why: Establishes the monorepo foundation — workspace resolution, task orchestration, and root-level configs. Everything else depends on this.
  - Files: `package.json`, `pnpm-workspace.yaml`, `turbo.json`, `.npmrc`, `.prettierrc`, `.prettierignore`, `.gitignore`
  - Do: Create root `package.json` with `@repo/monorepo` name, `packageManager` field, workspace scripts proxying Turbo commands. Create `pnpm-workspace.yaml` with workspace globs and `catalog:` entries for shared versions (typescript ~5.9.3, eslint ^9.39.4, prettier ^3.8.1). Create `turbo.json` with tasks: build (dependsOn ^build), dev (persistent, no cache), lint, check-types (dependsOn ^build), format. Add `.turbo/` to `.gitignore`. Create `.npmrc` with minimal config. Create `.prettierrc` with standard rules. Create `.prettierignore` for dist/node_modules/etc. Create empty placeholder dirs for all four apps.
  - Verify: `cat package.json turbo.json pnpm-workspace.yaml` show correct structure
  - Done when: All root config files exist with correct content, placeholder dirs created

- [x] **T02: Create shared TypeScript and ESLint config packages** `est:45m`
  - Why: Delivers the shared config packages that every app and package will extend. Proves the Turbo pipeline works end-to-end with `lint` and `check-types`.
  - Files: `packages/typescript-config/package.json`, `packages/typescript-config/base.json`, `packages/typescript-config/node.json`, `packages/typescript-config/react.json`, `packages/typescript-config/nextjs.json`, `packages/eslint-config/package.json`, `packages/eslint-config/index.mjs`
  - Do: Create `@repo/typescript-config` with base (strict TS settings), node (extends base, Node module/target), react (extends base, JSX preserve, React types), nextjs (extends react, Next.js plugin paths). Create `@repo/eslint-config` with flat config using `tseslint.config()`, importing `@eslint/js`, `typescript-eslint`, `eslint-config-prettier`, `eslint-plugin-turbo`. Export base config array. Add `eslint.config.mjs` to the eslint-config package itself so it self-lints. Run `pnpm install`, then verify `pnpm lint` and `pnpm check-types` pass.
  - Verify: `pnpm install && pnpm lint && pnpm check-types`
  - Done when: All three commands exit 0, shared configs are importable by workspace packages

## Files Likely Touched

- `package.json`
- `pnpm-workspace.yaml`
- `turbo.json`
- `.npmrc`
- `.prettierrc`
- `.prettierignore`
- `.gitignore`
- `packages/typescript-config/package.json`
- `packages/typescript-config/base.json`
- `packages/typescript-config/node.json`
- `packages/typescript-config/react.json`
- `packages/typescript-config/nextjs.json`
- `packages/eslint-config/package.json`
- `packages/eslint-config/index.mjs`
