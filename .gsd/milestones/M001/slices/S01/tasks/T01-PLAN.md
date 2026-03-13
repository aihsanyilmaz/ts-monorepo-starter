---
estimated_steps: 5
estimated_files: 7
---

# T01: Scaffold root workspace and Turbo pipeline

**Slice:** S01 — Monorepo Altyapısı
**Milestone:** M001

## Description

Create the root monorepo skeleton: `package.json` with workspace scripts, `pnpm-workspace.yaml` with workspace globs and version catalog, `turbo.json` with the full task pipeline, and supporting root configs (`.npmrc`, `.prettierrc`, `.prettierignore`, `.gitignore` updates). Also create empty placeholder directories for all four apps so the workspace globs resolve.

## Steps

1. Create root `package.json`:
   - Name: `@repo/monorepo` (private)
   - `packageManager: "pnpm@10.11.0"` (match installed version, verify with `pnpm --version`)
   - Scripts: `dev`, `build`, `lint`, `check-types`, `format`, `format:check` — all proxying to `turbo run <task>`
   - `format` uses Prettier directly (not via Turbo, since it's a root-level concern) — actually, route through Turbo for consistency
   - `engines: { "node": ">=18" }`
   - devDependencies: `turbo` (use `catalog:`)

2. Create `pnpm-workspace.yaml`:
   - `packages: ["apps/*", "packages/*"]`
   - `catalog:` section with shared versions: typescript ~5.9.3, eslint ^9.39.4, prettier ^3.8.1, @eslint/js ^9.39.4, typescript-eslint ^8.57.0, eslint-config-prettier ^10.1.8, eslint-plugin-turbo ^2.8.16
   - Check exact pnpm 10 catalog syntax

3. Create `turbo.json`:
   - `$schema: "https://turborepo.dev/schema.json"`
   - Tasks: `build` (dependsOn: ["^build"], outputs: ["dist/**"]), `dev` (persistent: true, cache: false), `lint` (dependsOn: ["^build"]), `check-types` (dependsOn: ["^build"]), `format` (cache: false)

4. Create root config files:
   - `.npmrc`: `auto-install-peers=true`, `strict-peer-dependencies=false` (keep minimal, Expo may need `node-linker=hoisted` later)
   - `.prettierrc`: JSON with `semi: true`, `singleQuote: true`, `tabWidth: 2`, `trailingComma: "all"`, `printWidth: 100`
   - `.prettierignore`: `node_modules`, `dist`, `.next`, `.turbo`, `build`, `coverage`, `pnpm-lock.yaml`
   - Update `.gitignore`: add `.turbo/` entry

5. Create placeholder app directories:
   - `apps/honojs/.gitkeep`
   - `apps/nestjs/.gitkeep`
   - `apps/nextjs/.gitkeep`
   - `apps/react-native/.gitkeep`

## Must-Haves

- [ ] Root `package.json` has correct workspace scripts and `packageManager` field
- [ ] `pnpm-workspace.yaml` has workspace globs and version catalog
- [ ] `turbo.json` has all five tasks with correct dependency/caching config
- [ ] `.gitignore` includes `.turbo/`
- [ ] All four app placeholder directories exist

## Verification

- All root config files exist and have valid JSON/YAML
- `cat turbo.json | jq .` parses without error
- `ls apps/` shows all four app directories

## Inputs

- `.gitignore` — existing file, needs `.turbo/` addition
- S01-RESEARCH.md — version matrix, catalog syntax, turbo.json task config

## Expected Output

- `package.json` — root workspace package with scripts and engine constraints
- `pnpm-workspace.yaml` — workspace definition with version catalog
- `turbo.json` — complete task pipeline
- `.npmrc`, `.prettierrc`, `.prettierignore` — root tooling configs
- `.gitignore` — updated with Turbo cache exclusion
- `apps/honojs/.gitkeep`, `apps/nestjs/.gitkeep`, `apps/nextjs/.gitkeep`, `apps/react-native/.gitkeep` — placeholder dirs
