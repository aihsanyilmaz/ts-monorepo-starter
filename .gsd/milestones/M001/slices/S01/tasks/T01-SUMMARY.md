---
id: T01
parent: S01
milestone: M001
provides:
  - Root workspace package.json with scripts and packageManager field
  - pnpm-workspace.yaml with workspace globs and version catalog
  - turbo.json with five-task pipeline
  - Root tooling configs (.npmrc, .prettierrc, .prettierignore)
  - Placeholder directories for all four apps
key_files:
  - package.json
  - pnpm-workspace.yaml
  - turbo.json
  - .npmrc
  - .prettierrc
  - .prettierignore
  - .gitignore
key_decisions:
  - "packageManager set to pnpm@10.32.1 (actual installed version, not 10.11.0 from initial plan)"
  - "format:check script routes through turbo with -- --check rather than calling prettier directly"
patterns_established:
  - "All workspace scripts proxy through turbo run for consistent orchestration"
  - "pnpm catalog: protocol for shared dependency version management"
observability_surfaces:
  - none
duration: 5m
verification_result: passed
completed_at: 2026-03-13
blocker_discovered: false
---

# T01: Scaffold root workspace and Turbo pipeline

**Created root monorepo skeleton with workspace scripts, Turbo pipeline, version catalog, and placeholder app directories.**

## What Happened

Created all root-level config files from scratch on a clean repo. Root `package.json` uses `@repo/monorepo` (private) with six scripts all proxying through `turbo run`. `pnpm-workspace.yaml` defines `apps/*` and `packages/*` globs with a catalog section pinning eight shared dependency versions. `turbo.json` defines five tasks with correct dependency/caching semantics (build with ^build deps and dist outputs, dev as persistent/uncached, lint and check-types with ^build deps, format as uncached). Added `.turbo/` to existing `.gitignore`. Created minimal `.npmrc`, `.prettierrc`, and `.prettierignore`.

## Verification

- `cat turbo.json | jq .` — valid JSON, all five tasks present ✓
- `cat .prettierrc | jq .` — valid JSON ✓
- `cat package.json | jq .` — valid JSON, correct scripts and packageManager ✓
- `ls apps/` — honojs, nestjs, nextjs, react-native all present ✓
- `grep '.turbo/' .gitignore` — entry found ✓
- `pnpm install` — exits 0, turbo 2.8.16 resolved from catalog ✓
- `turbo build` — exits 0, pipeline validates with 0 packages in scope ✓

### Slice-level verification (partial — expected for T01):

- ✅ `pnpm install` exits 0 with workspaces resolved
- ✅ `turbo build` exits 0
- ⏳ `pnpm lint` — needs T02 (eslint-config package)
- ⏳ `pnpm check-types` — needs T02 (typescript-config package)
- ⏳ `pnpm format --check` — needs T02 (prettier configured per-package)

## Diagnostics

None — this task produces static config files. Verify with `jq` for JSON validity and `pnpm install` for workspace resolution.

## Deviations

- `packageManager` field uses `pnpm@10.32.1` (actual installed version) instead of `10.11.0` from the task plan. The plan predates the current environment; using the real version avoids pnpm auto-download mismatches.

## Known Issues

None.

## Files Created/Modified

- `package.json` — root workspace package with scripts, engines, and turbo devDependency via catalog
- `pnpm-workspace.yaml` — workspace globs and version catalog for 8 shared dependencies
- `turbo.json` — five-task pipeline (build, dev, lint, check-types, format)
- `.npmrc` — minimal config (auto-install-peers, relaxed peer deps)
- `.prettierrc` — standard formatting rules (semi, singleQuote, trailing commas, 100 width)
- `.prettierignore` — excludes node_modules, dist, .next, .turbo, build, coverage, lockfile
- `.gitignore` — added `.turbo/` entry
- `apps/honojs/.gitkeep` — placeholder
- `apps/nestjs/.gitkeep` — placeholder
- `apps/nextjs/.gitkeep` — placeholder
- `apps/react-native/.gitkeep` — placeholder
