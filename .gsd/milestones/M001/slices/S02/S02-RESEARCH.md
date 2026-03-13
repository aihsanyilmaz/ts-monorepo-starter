# S02: Paylaşımlı Paketler (env, db, shared) — Research

**Date:** 2026-03-13

## Summary

S02 delivers three shared packages consumed by all downstream slices (S03–S06). The core libraries are well-established: `@t3-oss/env-core` for env validation, `drizzle-orm` + `better-sqlite3` for database, and `zod` (v4) for schemas. All three have compatible versions and support Zod 4. The main risk is getting the build pipeline right — these packages need to produce ESM + DTS output via `tsup` so that four different app runtimes (Hono/Node, NestJS, Next.js, Expo/Metro) can consume them without transpilation quirks.

The `packages/env` package should be a thin wrapper: re-export `createEnv` from `@t3-oss/env-core`, re-export `z` from zod, and optionally export a shared base preset for common variables like `NODE_ENV`. Each app then imports from `@repo/env` and builds its own schema. The t3-env `extends` pattern supports this monorepo preset pattern natively.

The `packages/db` package provides Drizzle schema definitions and a `createDb` factory for better-sqlite3. "PostgreSQL-ready" is documented but not dual-implemented — Drizzle's SQLite and PostgreSQL schema APIs use different column type imports, so a true runtime dialect switch would require an abstraction layer that adds complexity without value in a starter template. The schema is written for SQLite; the README documents how to swap.

## Recommendation

Use `tsup` as the build tool for all three packages — it handles ESM output, declaration generation, and tree-shaking cleanly. Each package gets `"type": "module"` in package.json with exports pointing to `dist/index.js` and `dist/index.d.ts`. This matches turbo.json's `"outputs": ["dist/**"]` convention from S01.

Use Zod 4 (latest stable `^4.0.0`) as the single validation library. Pin it in the pnpm catalog so all packages share one version.

For env: wrap `@t3-oss/env-core` rather than hand-rolling. The preset/extends pattern it provides is designed exactly for monorepo use.

For db: better-sqlite3 as the default driver (zero-config, file-based). Export schema and a `createDb` factory. Include drizzle-kit config for migrations but don't run migrations in the build step — that's a runtime/dev concern.

For shared: pure Zod schemas + inferred types. No runtime dependencies beyond zod. Keep it simple — a few example schemas (User, ApiResponse) to demonstrate the pattern.

## Don't Hand-Roll

| Problem | Existing Solution | Why Use It |
|---------|------------------|------------|
| Env validation with type safety | `@t3-oss/env-core` (v0.13.10) | Battle-tested, supports Zod 4, has monorepo preset/extends pattern, handles server/client separation |
| ORM + schema definitions | `drizzle-orm` (v0.45.1) | Type-safe, lightweight, supports SQLite + PostgreSQL, schema-as-code |
| SQLite driver | `better-sqlite3` (v12.6.2) | Synchronous, fast, zero-config file-based SQLite |
| Schema validation | `zod` (v4.3.6) | TypeScript-first, inferred types, widely adopted |
| Package bundling | `tsup` (v8.5.1) | ESM + DTS output, esbuild-based, fast, handles workspace packages well |
| Migration tooling | `drizzle-kit` (v0.31.9) | Companion to drizzle-orm, generates SQL migrations from schema |

## Existing Code and Patterns

- `packages/typescript-config/node.json` — extends base.json with `NodeNext` module/resolution. Shared packages should extend this since they run in Node.
- `packages/typescript-config/base.json` — strict mode, `declaration: true`, `declarationMap: true`, `sourceMap: true`. tsup handles its own DTS generation so these flags are mainly for IDE support.
- `packages/eslint-config/index.mjs` — flat config with typescript-eslint. Shared packages should create an `eslint.config.mjs` that imports from `@repo/eslint-config`.
- `pnpm-workspace.yaml` — has `catalog:` section for shared versions. Add `zod`, `@t3-oss/env-core`, `drizzle-orm`, `better-sqlite3`, `drizzle-kit`, `tsup` to catalog.
- `turbo.json` — build outputs to `dist/**`, build depends on `^build`. Shared packages must have a `build` script.
- S01 pattern: packages use `@repo/` scope prefix (D011), shared versions via catalog (D012).

## Constraints

- **Module format**: Packages must output ESM (matches `"module": "ESNext"` in base tsconfig and modern Node.js ecosystem). Use `"type": "module"` in package.json.
- **Turbo pipeline**: `build` task runs `^build` (dependencies first). Each package needs a `build` script, outputs to `dist/`.
- **pnpm catalog**: Shared dependency versions go in `pnpm-workspace.yaml` catalog section. All three packages should reference `catalog:` for zod, typescript, eslint, etc.
- **TypeScript strict mode**: Enforced by base.json. All code must pass strict checks.
- **better-sqlite3 native module**: Requires node-gyp/compilation. May cause issues on some systems. This is acceptable for a dev-focused starter — document the requirement.
- **Zod 4 breaking changes**: `z.record()` no longer accepts single argument, must use `z.record(keySchema, valueSchema)`. `.email()` is now `z.email()` (top-level). Minor but needs awareness when writing schemas.

## Common Pitfalls

- **tsup DTS generation with workspace deps** — tsup's `dts: true` can fail if it tries to bundle types from workspace packages. Use `external` option to exclude workspace dependencies from the bundle.
- **NodeNext resolution + .js extensions** — If not using tsup, TypeScript with `NodeNext` requires `.js` extensions in import paths even for `.ts` files. tsup eliminates this concern by bundling.
- **better-sqlite3 in Expo/React Native** — better-sqlite3 is a native Node.js module. It cannot run in Expo. This is fine — `packages/db` is only consumed by backend apps (S03, S04). Frontend apps (S05, S06) don't import db directly, they use the API client.
- **t3-env runtimeEnv** — `@t3-oss/env-core` requires `runtimeEnv: process.env` (or explicit mapping). For Next.js, use `@t3-oss/env-nextjs` instead which handles `NEXT_PUBLIC_` prefix. The `packages/env` package should re-export from `@t3-oss/env-core`; the Next.js app uses `@t3-oss/env-nextjs` directly.
- **Circular dependency with shared + db** — Keep `packages/shared` independent of `packages/db`. Shared types flow one way: shared → apps, db → apps. Never db → shared or shared → db.
- **drizzle-kit dialect lock-in** — drizzle-kit config must specify `dialect: "sqlite"`. If someone wants PostgreSQL, they change the dialect and column imports. Document this switchover clearly.

## Open Risks

- **better-sqlite3 compilation on CI/different OS** — Native module needs build tools. Most dev machines and CI have this, but it's a friction point for template users on minimal setups. Mitigated by documenting prerequisites.
- **Zod 4 + t3-env edge cases** — t3-env supports Zod 4 (`^3.24.0 || ^4.0.0` peer range) but is relatively new in Zod 4 territory. Should verify the combination works before committing.
- **drizzle-zod Zod 4 compatibility** — drizzle-zod v0.8.3 supports `zod ^3.25.0 || ^4.0.0`. Not used in S02 directly but relevant for downstream slices — worth verifying early.
- **tsup config complexity** — Each package needs a `tsup.config.ts`. Keep configs minimal (entry, format, dts, external) to avoid maintenance burden.

## Package Architecture

### `packages/env`
```
packages/env/
  src/
    index.ts          # re-exports createEnv from @t3-oss/env-core, z from zod
  package.json        # @repo/env, deps: @t3-oss/env-core, zod
  tsconfig.json       # extends @repo/typescript-config/node.json
  tsup.config.ts
  eslint.config.mjs
```

**Exports:**
- `createEnv` — re-export from `@t3-oss/env-core`
- `z` — re-export from `zod`

This keeps apps' `env.ts` files clean: `import { createEnv, z } from "@repo/env"`.

### `packages/db`
```
packages/db/
  src/
    index.ts          # exports createDb factory, re-exports schema
    schema.ts         # Drizzle table definitions (users, posts as examples)
    client.ts         # createDb factory using better-sqlite3
  drizzle.config.ts   # drizzle-kit config
  package.json        # @repo/db, deps: drizzle-orm, better-sqlite3
  tsconfig.json
  tsup.config.ts
  eslint.config.mjs
```

**Exports:**
- `createDb(url?: string)` — returns Drizzle instance with better-sqlite3
- `schema` — all table definitions (star export)
- Individual table exports (`users`, `posts`)

### `packages/shared`
```
packages/shared/
  src/
    index.ts          # barrel export
    schemas/
      user.ts         # UserSchema, User type
      api-response.ts # ApiResponseSchema, ApiResponse type
    types/
      index.ts        # any pure TypeScript types not derived from Zod
  package.json        # @repo/shared, deps: zod
  tsconfig.json
  tsup.config.ts
  eslint.config.mjs
```

**Exports:**
- Zod schemas: `UserSchema`, `ApiResponseSchema`
- Inferred types: `User`, `ApiResponse`
- Type utilities as needed

## Requirements Coverage

| Requirement | Role | Coverage Notes |
|---|---|---|
| R004 — Zod env validation base | **Primary owner** | `packages/env` wrapping `@t3-oss/env-core` + zod re-export |
| R005 — Drizzle ORM DB package | **Primary owner** | `packages/db` with better-sqlite3, schema, createDb factory |
| R006 — Shared types and Zod schemas | **Primary owner** | `packages/shared` with example schemas + inferred types |
| R012 — Per-app env config | **Primary owner (infra)** | packages/env provides the foundation; actual per-app env.ts files are created in S03–S06 |

## Skills Discovered

| Technology | Skill | Status |
|------------|-------|--------|
| Drizzle ORM | `bobmatnyc/claude-mpm-skills@drizzle-orm` | available (1.6K installs) — general Drizzle ORM patterns |
| Drizzle ORM | `bobmatnyc/claude-mpm-skills@drizzle-migrations` | available (428 installs) — migration-specific |
| T3 Env | none found | no skills available |
| Zod | `pproenca/dot-skills@zod` | available (719 installs) — Zod patterns |

## Sources

- t3-env core API: `createEnv` with server/client/shared separation, `extends` for monorepo presets (source: [t3-env docs](https://github.com/t3-oss/t3-env))
- t3-env supports Zod 4 via peer dep `zod: ^3.24.0 || ^4.0.0` (source: npm registry)
- Drizzle ORM better-sqlite3 setup: `drizzle('drizzle-orm/better-sqlite3')` factory (source: [Drizzle docs](https://orm.drizzle.team))
- Drizzle-kit SQLite config: `defineConfig({ dialect: "sqlite", dbCredentials: { url: "sqlite.db" } })` (source: [Drizzle docs](https://orm.drizzle.team))
- Zod 4 breaking changes: `z.record()` requires two args, import from `"zod"` still works (source: [Zod v4 changelog](https://zod.dev/v4/changelog))
- drizzle-zod v0.8.3 supports Zod 4 via peer dep `zod: ^3.25.0 || ^4.0.0` (source: npm registry)
