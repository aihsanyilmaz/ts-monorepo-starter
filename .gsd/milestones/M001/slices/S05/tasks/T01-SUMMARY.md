---
id: T01
parent: S05
milestone: M001
provides:
  - Next.js 16 App Router app at apps/nextjs with build/lint/check-types passing
  - Env validation via @t3-oss/env-nextjs (NEXT_PUBLIC_API_URL, NODE_ENV)
  - ESLint flat config with shared base + react-hooks + @next/next plugins
  - Minimal app shell (layout + page) ready for styling in T02
key_files:
  - apps/nextjs/package.json
  - apps/nextjs/tsconfig.json
  - apps/nextjs/next.config.ts
  - apps/nextjs/src/env.ts
  - apps/nextjs/eslint.config.mjs
  - apps/nextjs/src/app/layout.tsx
  - apps/nextjs/src/app/page.tsx
key_decisions:
  - Added zod as direct dependency (not just via @repo/env) since @t3-oss/env-nextjs imports it directly
  - Added NODE_ENV to turbo.json globalEnv to satisfy turbo/no-undeclared-env-vars lint rule
patterns_established:
  - Next.js ESLint config pattern: spread shared config + react-hooks plugin + @next/next plugin + .next/ ignore
  - Next.js env pattern: @t3-oss/env-nextjs with explicit runtimeEnv mapping and emptyStringAsUndefined
observability_surfaces:
  - t3-env throws descriptive error at startup if NEXT_PUBLIC_API_URL is missing/invalid
duration: ~10m
verification_result: passed
completed_at: 2026-03-13
blocker_discovered: false
---

# T01: Scaffold Next.js app with config, env, and ESLint

**Scaffolded Next.js 16 App Router app at apps/nextjs with full monorepo integration — build, lint, and type-check all pass.**

## What Happened

Created the foundational Next.js app with all configuration files. Package.json declares Next.js 16.1.6, React 19, workspace deps (`@repo/api-client`, `@repo/env`, `@repo/shared`), and `@t3-oss/env-nextjs` + `zod` for env validation. TypeScript config extends the monorepo's `nextjs.json` base with `@/*` path alias. `next.config.ts` sets `transpilePackages` for workspace packages and `outputFileTracingRoot` for monorepo-aware tracing. Env validation enforces `NEXT_PUBLIC_API_URL` (required URL) and `NODE_ENV` (enum with default). ESLint flat config layers react-hooks and @next/next plugins on top of the shared base. Minimal layout and page provide the app shell.

Two fixes during implementation: (1) added `zod` as direct dependency since `@t3-oss/env-nextjs` imports it at the app level, not through `@repo/env`; (2) added `NODE_ENV` to `turbo.json` `globalEnv` to satisfy the turbo ESLint plugin's undeclared-env-vars rule.

## Verification

- `pnpm install` — resolved without errors (42 packages added)
- `pnpm build --filter @repo/nextjs` — exits 0, produces `.next/` with static pages (`/`, `/_not-found`)
- `pnpm lint --filter @repo/nextjs` — exits 0
- `pnpm check-types --filter @repo/nextjs` — exits 0
- `apps/nextjs/.env.example` exists with `NEXT_PUBLIC_API_URL=http://localhost:3001`

Slice-level verification (3/5 passing for this intermediate task):
- ✅ build exits 0
- ✅ lint exits 0
- ✅ check-types exits 0
- ⏳ dev server + curl — deferred to T03
- ⏳ shadcn/ui components — deferred to T02/T03

## Diagnostics

- `@t3-oss/env-nextjs` throws descriptive error listing missing/invalid vars at startup
- `.env` file loaded automatically by Next.js (logged in build output: `Environments: .env`)

## Deviations

- Added `zod` as direct dependency in package.json (plan didn't list it explicitly, but required by direct `import { z } from 'zod'` in env.ts)
- Added `NODE_ENV` to `turbo.json` `globalEnv` — necessary for turbo ESLint plugin compliance
- No `.gitkeep` existed to remove (directory didn't exist yet)

## Known Issues

- Turbo warns `no output files found for task @repo/nextjs#build` — the build task in turbo.json declares `outputs: ["dist/**"]` but Next.js outputs to `.next/`. This is cosmetic and will be addressed if a Next.js-specific turbo task config is needed later.

## Files Created/Modified

- `apps/nextjs/package.json` — dependency manifest with Next.js 16, React 19, workspace refs
- `apps/nextjs/tsconfig.json` — extends nextjs.json with @/* path alias
- `apps/nextjs/next.config.ts` — transpilePackages + outputFileTracingRoot
- `apps/nextjs/src/env.ts` — Zod env validation via @t3-oss/env-nextjs
- `apps/nextjs/eslint.config.mjs` — flat config with shared base + react-hooks + @next/next
- `apps/nextjs/src/app/layout.tsx` — minimal root layout
- `apps/nextjs/src/app/page.tsx` — minimal home page
- `apps/nextjs/.env.example` — documented env vars
- `apps/nextjs/.env` — local dev defaults (gitignored)
- `turbo.json` — added NODE_ENV to globalEnv
