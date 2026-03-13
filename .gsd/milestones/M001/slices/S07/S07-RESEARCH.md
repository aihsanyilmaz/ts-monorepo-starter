# S07: Dokümantasyon & Final Polish — Research

**Date:** 2026-03-13

## Summary

S07 is the final slice — documentation and polish for the monorepo template. The codebase is fully functional: `pnpm build`, `pnpm lint`, and `pnpm check-types` all pass clean. All four apps (HonoJS, NestJS, Next.js, Expo) are built and integrated with shared packages.

The primary deliverable is documentation: a root README explaining architecture and quick-start, plus per-app and per-package READMEs. Secondary deliverables are missing `.env.example` files (honojs and nestjs lack them) and minor polish items like the turbo.json outputs warning for Next.js.

No external libraries or complex tooling needed — this is pure content creation informed by the actual codebase structure.

## Requirement Coverage

This slice owns or supports:
- **R013** (primary) — Root README + per-app/package README documentation
- **R014** (primary) — `pnpm dev` starts all apps (verification)
- **R016** (primary) — `.env.example` files and setup documentation

## Recommendation

Break into three tasks:

1. **T01: `.env.example` files + turbo.json polish** — Create missing `.env.example` for honojs and nestjs. Fix turbo.json outputs to include `.next/**` for nextjs build cache. Small, surgical fixes.

2. **T02: Per-app and per-package READMEs** — Write 6 package READMEs (`env`, `db`, `shared`, `api-client`, `eslint-config`, `typescript-config`) and 4 app READMEs (`honojs`, `nestjs`, `nextjs`, `react-native`). Each covers: what it is, how to use it, available scripts, env vars.

3. **T03: Root README + final integration verification** — Write the main README.md with architecture overview, quick-start guide, project structure, per-app descriptions, and contributing notes. Run final full verification (`pnpm install`, `pnpm build`, `pnpm lint`, `pnpm check-types`, `pnpm dev` smoke test).

## Don't Hand-Roll

| Problem | Existing Solution | Why Use It |
|---------|------------------|------------|
| n/a — this slice is pure documentation | n/a | No libraries needed |

## Existing Code and Patterns

- `apps/nextjs/.env.example` — existing pattern: one comment line + `KEY=default_value`. Follow this format for honojs/nestjs.
- `apps/react-native/.env.example` — same pattern as nextjs, confirms convention.
- `apps/honojs/src/env.ts` — source of truth for honojs env vars: `PORT` (default 3001), `NODE_ENV`, `DATABASE_URL` (default `./data/dev.db`).
- `apps/nestjs/src/env.ts` — source of truth for nestjs env vars: `PORT` (default 3002), `NODE_ENV`, `DATABASE_URL` (default `./data/dev.db`).
- `apps/nextjs/src/env.ts` — uses `@t3-oss/env-nextjs`, env vars: `NEXT_PUBLIC_API_URL`, `NODE_ENV`.
- `apps/react-native/src/env.ts` — uses `@repo/env` with `clientPrefix: 'EXPO_PUBLIC_'`, env vars: `EXPO_PUBLIC_API_URL`.
- `packages/eslint-config/index.mjs` — flat config combining `@eslint/js`, `typescript-eslint`, `eslint-config-prettier`, `eslint-plugin-turbo`.
- `packages/typescript-config/` — four JSON configs: `base.json`, `node.json`, `react.json`, `nextjs.json`.
- `packages/db/src/schema.ts` — Drizzle schema with `users` and `posts` tables (SQLite).
- `packages/db/src/client.ts` — `createDb(url)` factory using `better-sqlite3`.
- `packages/shared/src/` — exports `UserSchema`, `ApiResponseSchema` with Zod.
- `packages/api-client/src/index.ts` — `createApiClient(baseUrl)` wrapping Hono RPC `hc<AppType>`.
- `turbo.json` — outputs only `dist/**`; Next.js outputs to `.next/`, causing cache warning.

## Constraints

- **All env defaults are coded in `env.ts` files** — `.env.example` files document vars but defaults come from Zod schemas. Backend apps work without any `.env` file (all vars have defaults). Frontend apps require `API_URL` to be set.
- **10 READMEs needed** — 4 apps + 6 packages + 1 root = 11 total README files. Each should be concise but complete enough for a template user.
- **No `node-linker=hoisted`** — the `.npmrc` uses default settings; Expo works without hoisted mode. READMEs should NOT mention this as a requirement.
- **NestJS uses `@swc-node/register` for dev** (D023) — worth documenting as it's unusual. Production build uses `tsc` (D024).
- **Hono RPC type chain** — `api-client` depends on `honojs` for `AppType`. This cross-boundary type dependency should be explained in the architecture docs.
- **Port allocation** — HonoJS: 3001, NestJS: 3002, Next.js: 3000, Expo: 8081. Must be documented clearly.
- **pnpm catalog** — shared dependency versions managed in `pnpm-workspace.yaml`. Worth a brief mention in root README.
- **`pnpm.onlyBuiltDependencies`** — allowlist for `better-sqlite3`, `@nestjs/core`, `@swc/core` native addons. Document in root README if relevant.

## Common Pitfalls

- **turbo.json outputs mismatch** — Next.js outputs to `.next/`, not `dist/`. The current `outputs: ["dist/**"]` means Next.js builds are never cached by Turbo. Fix: add per-app output overrides or use `turbo.json` pipeline config. However, this must be done carefully — Next.js build caching with Turbo can be complex; a simpler approach is adding `.next/**` as an additional output pattern.
- **`.env.example` with actual defaults vs. placeholders** — Backend apps have sensible defaults in Zod; `.env.example` should show the defaults as documentation, not require manual setup. Frontend apps need real values (API URL).
- **Overly verbose READMEs** — Template READMEs should be concise and actionable. Users want "how to start" not "why we chose this". Architecture reasoning goes in root README, not per-app READMEs.
- **Stale documentation** — Every script and env var referenced in READMEs must match the actual `package.json` scripts and `env.ts` files. Verify after writing.

## Open Risks

- **turbo.json outputs change could break caching** — Adding `.next/**` to outputs should be safe, but need to verify it doesn't interact badly with Next.js's own cache. Low risk.
- **Expo web-only `build` command** — Current build script is `expo export --platform web`, which may confuse users expecting native builds. README should clarify this.
- **Placeholder slice summaries (S01-S06)** — All prior slice summaries are doctor-created placeholders. Not a risk for S07 execution, but worth noting that the `.gsd` state is incomplete.

## Skills Discovered

| Technology | Skill | Status |
|------------|-------|--------|
| Turborepo | `vercel/turborepo@turborepo` (10.5K installs) | available — not needed for docs-only work |
| Monorepo management | `aj-geddes/useful-ai-prompts@monorepo-management` (117 installs) | available — low relevance |

No skills recommended for installation — this slice is documentation and minor config polish, not framework integration.

## Sources

- Codebase exploration: all findings derived from reading actual source files in the monorepo
- Decision register (`.gsd/DECISIONS.md`): D020 (Hono port 3001), D023-D026 (NestJS tooling), D027 (Next.js env), D029 (Tailwind v4), D031 (CORS), D032-D034 (Expo config)
