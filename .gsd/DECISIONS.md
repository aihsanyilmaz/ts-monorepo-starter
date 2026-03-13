# Decisions Register

<!-- Append-only. Never edit or remove existing rows.
     To reverse a decision, add a new row that supersedes it.
     Read this file at the start of any planning or research phase. -->

| # | When | Scope | Decision | Choice | Rationale | Revisable? |
|---|------|-------|----------|--------|-----------|------------|
| D001 | M001 | arch | Package manager | pnpm | Turborepo's recommended companion, strict dependency resolution, workspace support | No |
| D002 | M001 | arch | Backend strategy | Pick-your-backend (HonoJS or NestJS) | Template users have different needs — lightweight vs enterprise | No |
| D003 | M001 | arch | UI sharing between web and mobile | No UI sharing — business logic only | shadcn/ui (web) and React Native components are incompatible; share types, schemas, hooks, API client instead | Yes — if react-native-web explored |
| D004 | M001 | data | Default database | SQLite (dev) + PostgreSQL adapter (prod) | Zero-config local dev, production-ready option available | Yes — if other DBs needed |
| D005 | M001 | arch | Env validation pattern | Zod base in packages/env, per-app derived schemas | Each app has different env needs but shares validation infrastructure | No |
| D006 | M001 | arch | API type safety | Hono RPC (when using HonoJS backend) | Zero-codegen type safety, built into Hono | No |
| D007 | M001 | arch | Web framework | Next.js + shadcn/ui | SSR/SSG/SEO for web; shadcn/ui for high-quality, customizable components | No |
| D008 | M001 | arch | Mobile framework | Expo (React Native) with web output | Cross-platform from single codebase, SDK 52+ automatic monorepo support | No |
| D009 | M001 | convention | App directory naming | apps/honojs, apps/nestjs, apps/nextjs, apps/react-native | Descriptive, framework-named directories | No |
| D010 | S01 | tooling | ESLint pinned to 9.x | ESLint ^9.39.4, not 10.x | eslint-plugin-react and eslint-plugin-react-hooks don't support ESLint 10 yet — blocks S05/S06 | Yes — when React plugins support ESLint 10 |
| D011 | S01 | convention | Workspace package scope | `@repo/` prefix | Turborepo convention, avoids npm name conflicts, clear internal-only signal | No |
| D012 | S01 | tooling | pnpm catalog for shared versions | Use `catalog:` protocol in pnpm-workspace.yaml | Single source of truth for TypeScript, ESLint, Prettier versions across all workspace packages | No |
| D013 | S01 | convention | eslint-config has no check-types | Skip tsc on pure-JS config packages | Package is .mjs only; checkJs flags third-party type mismatches that are not actionable. Lint covers correctness. | No |
| D014 | S02 | tooling | tsup for shared package builds | tsup with ESM format + DTS generation | Handles ESM output, declaration generation, and tree-shaking cleanly; avoids NodeNext .js extension complexity | No |
| D015 | S02 | tooling | Zod 4 as validation library | zod ^4.0.0 via pnpm catalog | Latest stable, TypeScript-first, supported by t3-env and drizzle-zod | Yes — if Zod 4 compat issues arise |
| D016 | S02 | arch | packages/shared independent of packages/db | No shared→db or db→shared imports | Prevents circular dependencies; types flow one-way: shared→apps, db→apps | No |
| D017 | S02 | arch | better-sqlite3 external in tsup | Mark native module as external, not bundled | Native modules cannot be bundled by esbuild; must remain as require() at runtime | No |
| D018 | S02 | tooling | pnpm.onlyBuiltDependencies for native addons | Whitelist better-sqlite3 in root package.json | pnpm v10 blocks postinstall scripts by default; explicit allowlist needed for native compilation | No |
| D019 | S03 | arch | api-client depends on honojs app for AppType | packages/api-client → apps/honojs workspace dependency (type-only import) | Standard Hono RPC monorepo pattern; turbo ^build handles ordering; enables end-to-end type safety without codegen | No |
| D020 | S03 | convention | Hono API default port 3001 | PORT defaults to 3001, not 3000 | Avoids collision with Next.js default port (3000); each app gets a distinct default port | No |
| D021 | S03 | tooling | skipNodeModulesBundle for app tsup configs | Use tsup `skipNodeModulesBundle: true` for apps | Apps are not libraries — no need to bundle deps; avoids maintaining external lists as deps grow | No |
| D022 | S03 | arch | Idempotent table bootstrap at app startup | CREATE TABLE IF NOT EXISTS in index.ts | No migration system exists yet; app must self-bootstrap DB tables for dev experience | Yes — when migration system added |
| D023 | S04 | tooling | NestJS dev mode uses @swc-node/register | `node --watch --import @swc-node/register/esm` | esbuild/tsx cannot emit decorator metadata required by NestJS DI; SWC handles it natively | No |
| D024 | S04 | tooling | NestJS build uses tsc, not tsup | `tsc` for production build | tsup uses esbuild which strips decorator metadata; tsc emits it correctly | No |
| D025 | S04 | convention | NestJS API default port 3002 | PORT defaults to 3002 | Avoids collision with Next.js (3000) and HonoJS (3001) | No |
| D026 | S04 | tooling | @swc-node/register/esm-register for Node 24 | Use `esm-register` entry instead of `esm` | The `esm` entry uses deprecated loader hooks that don't intercept ESM resolution on Node 24; `esm-register` uses the current `--import` registration API and correctly maps `.js` → `.ts` | No |
