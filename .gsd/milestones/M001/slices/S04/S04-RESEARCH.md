# S04: NestJS API App — Research

**Date:** 2026-03-13

## Summary

NestJS 11 (latest: 11.1.16) is the current stable version and supports ESM — aligning well with our all-ESM shared packages (`@repo/env`, `@repo/db`, `@repo/shared`). The core technical challenge is **decorator metadata emission**: NestJS requires `emitDecoratorMetadata` for its DI system, but `tsx`/`esbuild` (used by the HonoJS app) cannot emit decorator metadata. This means the NestJS app needs a different dev tooling chain than HonoJS.

The recommended approach is to **avoid `@nestjs/cli`** (keeps the app a plain Turborepo workspace member like HonoJS) and instead use `@swc-node/register` for dev mode and `tsc` for production builds. SWC natively supports `legacyDecorator` + `decoratorMetadata`, is fast, and respects `tsconfig.json` settings. The app structure should mirror HonoJS for consistency: same env.ts pattern, same shared package imports, same `ApiResponse<T>` wrapper, same endpoint parity (health, users, posts).

Port should default to 3002 (HonoJS uses 3001, Next.js will use 3000) to avoid collisions during `pnpm dev`.

## Recommendation

**Use standalone NestJS (no `@nestjs/cli`)** within the Turborepo workspace. This keeps the app consistent with HonoJS — just another workspace app with its own `package.json`, `tsconfig.json`, and scripts. Use:

- **Dev**: `node --import @swc-node/register/esm src/main.ts` with `--watch` (Node 22+ has native `--watch`)
- **Build**: `tsc` (not tsup — decorator metadata needs real TypeScript emit)
- **Runtime**: `node dist/main.js`
- **Lint/check-types**: same ESLint config + `tsc --noEmit` as other apps

This avoids adding `@nestjs/cli` as a dev dependency, avoids `nest-cli.json`, and keeps Turborepo as the sole orchestrator.

## Don't Hand-Roll

| Problem | Existing Solution | Why Use It |
|---------|------------------|------------|
| Env validation | `@repo/env` (`createEnv` + `z`) | Established pattern from HonoJS app |
| Database access | `@repo/db` (`createDb`, `users`, `posts` schemas) | Shared Drizzle schema, same SQLite dev DB pattern |
| Shared types | `@repo/shared` (`User`, `ApiResponse`) | Type consistency across apps |
| Decorator metadata in dev | `@swc-node/register` | SWC handles `emitDecoratorMetadata` natively, fast startup |
| NestJS validation pipes | `class-validator` + `class-transformer` | NestJS's standard validation approach (decorator-based) |

## Existing Code and Patterns

- `apps/honojs/src/env.ts` — env validation pattern using `createEnv` from `@repo/env`. NestJS app should have identical structure with `PORT` defaulting to 3002.
- `apps/honojs/src/index.ts` — idempotent table bootstrap with `CREATE TABLE IF NOT EXISTS` at startup. NestJS app must do the same (D022).
- `apps/honojs/src/routes/users.ts` — CRUD endpoints using `@repo/db` schema and `@repo/shared` types. NestJS should expose same endpoints with same response shapes.
- `apps/honojs/tsup.config.ts` — uses `skipNodeModulesBundle: true`. NestJS will use `tsc` instead (decorator metadata), but same principle: no bundling deps.
- `apps/honojs/tsconfig.json` — extends `@repo/typescript-config/node.json`. NestJS will extend same base but add `experimentalDecorators` and `emitDecoratorMetadata`.
- `apps/honojs/eslint.config.mjs` — re-exports `@repo/eslint-config`. NestJS should do the same.
- `packages/db/src/client.ts` — `createDb(url)` returns sync Drizzle SQLite client. NestJS will use this directly.
- `packages/typescript-config/node.json` — extends `base.json`, sets `module: NodeNext`, `moduleResolution: NodeNext`. Compatible with NestJS + ESM.

## Constraints

- **`emitDecoratorMetadata` required** — NestJS DI uses `reflect-metadata` at runtime. The tsconfig must enable `experimentalDecorators: true` and `emitDecoratorMetadata: true`. This is NestJS-specific; no other app in the monorepo needs it.
- **`reflect-metadata` import at entry point** — NestJS needs `import 'reflect-metadata'` at the top of `main.ts` before any NestJS imports.
- **CJS interop with ESM packages** — `@repo/db`, `@repo/env`, `@repo/shared` are all `"type": "module"` with ESM-only exports. NestJS app must also be `"type": "module"` and use ESM imports. With NestJS 11 + NodeNext module resolution this should work.
- **`pnpm.onlyBuiltDependencies`** — `better-sqlite3` is already whitelisted in root `package.json` (D018).
- **Port allocation** — 3000 (Next.js), 3001 (HonoJS, D020), 3002 (NestJS), 8081 (Expo).
- **No tsup for build** — esbuild cannot emit decorator metadata. Must use `tsc` for the build step. The `build` script output goes to `dist/` (matches turbo.json `outputs: ["dist/**"]`).
- **`class-validator` and `class-transformer` need `experimentalDecorators`** — both rely on decorator metadata for validation. This is fine since NestJS already requires it.

## Common Pitfalls

- **Using `tsx` for NestJS dev mode** — esbuild silently drops decorator metadata, causing NestJS DI to fail with cryptic "undefined" dependency errors at runtime. Use `@swc-node/register` instead.
- **Forgetting `reflect-metadata` import** — NestJS silently fails at DI resolution without it. Must be the first import in `main.ts`.
- **`tsup` for NestJS build** — Same esbuild/decorator issue as tsx. Use `tsc` for build.
- **`.js` extensions in imports** — With `module: NodeNext`, TypeScript requires `.js` extensions in relative imports (`import { Foo } from './foo.js'`). All imports must include the extension.
- **Zod 4 `z.email()` syntax** — Zod 4 uses `z.string().check(z.email())` not `z.string().email()`. Pattern established in S02/S03.
- **NestJS monorepo mode confusion** — NestJS has its own `@nestjs/cli` monorepo mode. We are NOT using that. This is a standalone NestJS app within a Turborepo/pnpm workspace.
- **Drizzle sync API** — `@repo/db` uses `better-sqlite3` which is synchronous. NestJS services can call Drizzle methods directly without async wrappers (though async controller methods are fine).
- **`class-validator` vs Zod** — NestJS ecosystem typically uses `class-validator` for request validation via `ValidationPipe`. Since we already have Zod in `@repo/shared`, we could use `ZodValidationPipe` from `nestjs-zod` instead. However, `class-validator` is more idiomatic NestJS and better matches the decorator-based philosophy. Decision: use `class-validator` + `class-transformer` for NestJS request validation (DTOs), and `@repo/shared` types for response shapes.

## Open Risks

- **`@swc-node/register` + ESM + NestJS 11 compatibility** — This specific triple combination needs verification. If it fails, fallback is `ts-node` with SWC (`ts-node --esm -r @swc/register`) or simply running `tsc --watch` for dev.
- **Node.js `--watch` stability** — Using `node --watch --import @swc-node/register/esm src/main.ts` relies on Node 22+ watch mode. If unstable, fallback to `nodemon`.
- **Zod 4 + `class-validator` coexistence** — Both in the same app for different purposes (Zod in shared types, class-validator in DTOs). Should work but adds two validation libraries.

## Skills Discovered

| Technology | Skill | Status |
|------------|-------|--------|
| NestJS | `kadajett/agent-nestjs-skills@nestjs-best-practices` | available (7K installs) |
| NestJS | `sickn33/antigravity-awesome-skills@nestjs-expert` | available (973 installs) |

The `nestjs-best-practices` skill has significant adoption but is not required for this scope (basic CRUD app scaffold). The work is straightforward enough without it.

## Sources

- NestJS 11 is the current stable release (11.1.16), making ESM the default (source: npm registry, Google search)
- NestJS requires `experimentalDecorators` and `emitDecoratorMetadata` in tsconfig for DI to work (source: NestJS docs, TypeScript docs)
- esbuild (used by tsx and tsup) does not support `emitDecoratorMetadata` — NestJS DI breaks silently (source: esbuild GitHub, Stack Overflow)
- SWC supports `legacyDecorator` + `decoratorMetadata` natively, compatible with NestJS (source: SWC docs, NestJS SWC recipe)
- `@swc-node/register` respects tsconfig options including decorator settings (source: npm `@swc-node/register` docs)
- NestJS SWC builder recipe documents the `nest start -b swc -w` pattern (source: NestJS docs - SWC recipe)
