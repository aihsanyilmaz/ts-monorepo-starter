# S03: HonoJS API App + API Client — Research

**Date:** 2026-03-13

## Summary

S03 delivers two workspaces: `apps/honojs` (Hono API server with Node.js adapter, dummy CRUD endpoints, env validation, DB usage) and `packages/api-client` (thin wrapper re-exporting a typed `hc` client parameterized with the app's `AppType`).

The main risk — Hono RPC type export chain across package boundaries — is well-documented and solvable. The `api-client` package takes a workspace dependency on `apps/honojs` for a `type`-only import of `AppType`. This is the standard Hono monorepo pattern. Turbo's `^build` handles the build ordering naturally. TypeScript `strict: true` is already set in the shared base config, satisfying Hono RPC's requirement.

The S02 packages (`@repo/env`, `@repo/db`, `@repo/shared`) are all built with tsup, export ESM + DTS from `dist/`, and follow a consistent pattern. S03 should mirror this for `api-client` and use the same tsconfig/eslint base for the honojs app.

## Recommendation

**Approach:** Standard Hono RPC monorepo pattern.

1. **`apps/honojs`** — Hono app using `@hono/node-server`, routes defined with method chaining for type inference, `@hono/zod-validator` for request validation, `AppType` exported as `typeof routes`. Uses `@repo/env` for env validation (PORT, NODE_ENV, DATABASE_URL), `@repo/db` for Drizzle queries, `@repo/shared` for Zod schemas.

2. **`packages/api-client`** — Lightweight package that imports `AppType` from `apps/honojs` via workspace dependency (`type`-only), re-exports a `createApiClient(baseUrl: string)` factory using `hc<AppType>`. Consumers (Next.js, Expo) call `createApiClient` without knowing Hono internals. Also re-exports the `AppType` for advanced use.

3. **Build with tsup** for `api-client` (ESM + DTS), **tsx** for honojs dev server (no build step needed for dev; tsup for production build).

4. **Dev script:** `tsx watch src/index.ts` for hot-reload during development.

## Don't Hand-Roll

| Problem | Existing Solution | Why Use It |
|---------|------------------|------------|
| HTTP framework | `hono` | Ultrafast, Web Standards, built-in RPC type system |
| Node.js adapter | `@hono/node-server` | Official adapter, handles Node req/res → Web Standards |
| Request validation | `@hono/zod-validator` | Integrates with Hono's validator system, feeds RPC type inference |
| Dev server watch | `tsx` | Zero-config TypeScript execution with watch mode, ESM-native |
| Package bundling | `tsup` | Already used by all S02 packages, consistent pattern |
| Env validation | `@repo/env` (createEnv + z) | Already built in S02, t3-env + Zod 4 |
| Database | `@repo/db` (Drizzle + SQLite) | Already built in S02, schema + client factory |
| Shared types | `@repo/shared` | Already built in S02, Zod schemas + inferred types |

## Existing Code and Patterns

- `packages/env/src/index.ts` — Re-exports `createEnv` from `@t3-oss/env-core` and `z` from Zod. Each app creates its own `env.ts` calling `createEnv({ server: {...}, runtimeEnv: process.env })`.
- `packages/db/src/client.ts` — `createDb(url)` factory using `better-sqlite3` + Drizzle. Honojs app should call `createDb()` at startup with the DATABASE_URL from its env config.
- `packages/db/src/schema.ts` — `users` and `posts` tables. Dummy endpoints should do simple CRUD on these.
- `packages/shared/src/schemas/user.ts` — `UserSchema` Zod schema + `User` type. Note: `id` is `z.string()` but DB schema uses `integer` — dummy endpoints should handle this mismatch (coerce or treat differently).
- `packages/shared/src/schemas/api-response.ts` — `ApiResponseSchema` generic wrapper + `ApiResponse<T>` type. Use this as the standard response envelope.
- `packages/shared/tsup.config.ts` — Standard tsup config pattern to follow: `entry: ['src/index.ts'], format: ['esm'], dts: true`.
- `packages/*/package.json` — Consistent `exports` field pattern: `{ ".": { "import": "./dist/index.js", "types": "./dist/index.d.ts" } }`.
- `packages/typescript-config/node.json` — Extends base.json, sets `module: NodeNext`, `moduleResolution: NodeNext`. Both honojs app and api-client should extend this.
- `packages/db/tsup.config.ts` — Shows pattern for marking native modules as external. For api-client, `hono` should be external (it's a peer dep).

## Constraints

- **Zod 4 compatibility** — Catalog pins `zod: ^4.0.0`. `@hono/zod-validator@0.7.6` peer-deps include `zod: ^3.25.0 || ^4.0.0` — confirmed compatible.
- **`strict: true` required** — Hono RPC type inference requires `strict: true` in both server and client tsconfig. Already set in `packages/typescript-config/base.json` ✓.
- **Route chaining required** — `AppType` must be `typeof routes` where `routes` is the chained result of `app.route()` calls, not just `typeof app` if sub-routers are used.
- **ESM only** — All existing packages are `"type": "module"`. Honojs app and api-client must follow suit.
- **pnpm workspace dependency direction** — `packages/api-client` depending on `apps/honojs` is an inverted direction (package → app). This is fine for type-only imports in pnpm, and turbo `^build` handles ordering. Must mark hono as `external` in api-client's tsup config.
- **Shared Zod schemas vs DB schema mismatch** — `UserSchema.id` is `z.string()`, but `users.id` in DB is `integer`. Dummy endpoints should either coerce or use separate response types.
- **pnpm catalog** — New deps (`hono`, `@hono/node-server`, `@hono/zod-validator`, `tsx`) should be added to the pnpm catalog for version consistency.
- **`better-sqlite3` in `pnpm.onlyBuiltDependencies`** — Already whitelisted in root `package.json`. No additional native deps needed for S03.

## Common Pitfalls

- **`AppType` is `any` or loses inference** — Happens when routes aren't chained. Each route file must return `new Hono().get(...).post(...)` as a single chain, and the main app must chain `.route('/path', subRouter)` calls. The `AppType` must reference the result of the chain, not a separate `app` variable.
- **Hono client import path** — Must use `import { hc } from 'hono/client'`, not `import { hc } from 'hono'`. The client is a separate entry point.
- **tsup bundling hono into api-client** — If `hono` is bundled into `api-client`, consumers get duplicate Hono code. Mark `hono` as external in tsup config. Consumers will have `hono` as a transitive dep via `api-client`'s dependencies.
- **Dev mode: tsx vs tsup --watch** — `tsx watch` is better for the app's dev server (instant restart). `tsup --watch` is for packages that produce `dist/` for consumers. The honojs app doesn't need `dist/` for dev — it runs directly via tsx.
- **zValidator with Zod 4** — Zod 4's `z.object()` works the same as v3 for basic schemas. However, `z.string().email()` changed to `z.string().check(z.email())` in Zod 4. The existing `@repo/shared` already uses the v4 syntax. `@hono/zod-validator` 0.7.6 supports both.
- **Database file path** — `createDb()` defaults to `:memory:`. For the honojs app, should use a file path like `./data/dev.db` so data persists across restarts. The env config should provide `DATABASE_URL` defaulting to this.

## Open Risks

- **Turbo build ordering with package→app dependency** — `packages/api-client` depending on `apps/honojs` creates an unusual dependency direction. Turbo should handle this via `^build`, but it's worth verifying that `turbo build` resolves the correct order and doesn't create a cycle. Mitigation: test `pnpm build` early in implementation.
- **Large `AppType` types slowing IDE** — With many routes, the inferred `AppType` can slow TypeScript language server. For this template's dummy endpoints (small surface), this isn't an issue. Document the Hono best practice of splitting sub-clients for large APIs.
- **tsx compatibility with workspace packages** — `tsx watch` must correctly resolve `@repo/env`, `@repo/db`, `@repo/shared` workspace imports. Since these packages produce `dist/` via tsup, tsx should pick them up via the `exports` field. May need `--conditions` flag if tsx doesn't resolve workspace `exports` maps.

## Skills Discovered

| Technology | Skill | Status |
|------------|-------|--------|
| Hono | `yusukebe/hono-skill@hono` (2K installs, by Hono author) | available — `npx skills add yusukebe/hono-skill@hono` |
| Hono routing | `jezweb/claude-skills@hono-routing` (620 installs) | available — lower priority, overlaps with above |

## Sources

- Hono RPC type export: `AppType = typeof routes` pattern with chained sub-routers (source: [Hono RPC Guide](https://hono.dev/docs/guides/rpc))
- Hono RPC monorepo requirement: `strict: true` in both client and server tsconfig (source: [Hono RPC Guide](https://hono.dev/docs/guides/rpc))
- Hono Node.js adapter: `@hono/node-server` with `serve({ fetch: app.fetch, port })` (source: [Hono Node.js Getting Started](https://hono.dev/docs/getting-started/nodejs))
- Hono best practice: export `AppType` from route chain result (source: [Hono Best Practices](https://hono.dev/docs/guides/best-practices))
- `@hono/zod-validator@0.7.6` peer deps: `hono >=3.9.0`, `zod ^3.25.0 || ^4.0.0` — confirmed Zod 4 compatible (source: npm registry)
- Hono monorepo AppType cross-package import: workspace dependency + type-only import is standard pattern (source: Google Search synthesis of Hono community practices)
