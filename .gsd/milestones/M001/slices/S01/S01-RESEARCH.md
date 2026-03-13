# S01: Monorepo Altyapısı — Research

**Date:** 2026-03-13

## Summary

S01 owns R001 (Turborepo + pnpm workspace), R002 (shared TypeScript config), R003 (shared ESLint + Prettier config), R017 (Turbo task pipeline), and R018 (root config files). The repo is empty — just a `.gitignore`. All tooling is available globally: Node 24.14, pnpm 10.32, Turbo 2.8.16.

The main constraint is **ESLint version**: ESLint 10 is out but `eslint-plugin-react` (peer: `^9.7`) and `eslint-plugin-react-hooks` (peer: `^9.0`) don't support it yet. We must pin ESLint to 9.x to avoid breaking React/Next.js linting in later slices. `typescript-eslint@8.57` supports ESLint 9 fine.

TypeScript config uses the standard Turborepo pattern: a `@repo/typescript-config` package that exports base JSON files (`base.json`, `node.json`, `react.json`, `nextjs.json`), consumed via `"extends": "@repo/typescript-config/base.json"` in each workspace package.

## Recommendation

Follow Turborepo's official monorepo structure conventions exactly:
- `pnpm-workspace.yaml` with `apps/*` + `packages/*` globs
- `turbo.json` with tasks: `build`, `dev`, `lint`, `check-types`, `format`
- `@repo/typescript-config` package with exported JSON configs
- `@repo/eslint-config` package with flat config (ESLint 9 + typescript-eslint 8)
- Root `.prettierrc`, `.npmrc`, `.gitignore`
- Use pnpm `catalog` in `pnpm-workspace.yaml` for shared dependency versions

Use `@repo/` as the workspace scope prefix — Turborepo convention and avoids npm name conflicts.

## Don't Hand-Roll

| Problem | Existing Solution | Why Use It |
|---------|------------------|------------|
| Task orchestration + caching | Turborepo `turbo.json` | Handles dependency graph, caching, parallel execution out of the box |
| ESLint flat config for TS | `typescript-eslint` v8 `tseslint.config()` helper | Type-safe config builder, handles parser/plugin setup |
| Prettier + ESLint conflict | `eslint-config-prettier` | Disables formatting rules that conflict with Prettier |
| Workspace dependency versions | pnpm catalogs | Single source of truth for shared dep versions across workspace |

## Existing Code and Patterns

- `.gitignore` — exists, already has GSD-generated ignores plus common patterns (node_modules, dist, .next, .env). Will need additions for Turborepo (`.turbo/`).
- No other code exists. Clean slate.

## Constraints

- **ESLint must be 9.x** — `eslint-plugin-react` and `eslint-plugin-react-hooks` don't support ESLint 10 yet. Latest 9.x is 9.39.4.
- **TypeScript 5.9.3** — latest stable; `typescript-eslint@8.57` peer dep is `>=4.8.4 <6.0.0`, compatible.
- **pnpm 10.x** — still uses `pnpm-workspace.yaml` (not moved to `package.json`). Workspace protocol `workspace:*` for internal deps.
- **Node 18+ minimum** — stated in M001-CONTEXT. We're on 24, but `engines` field should specify `>=18`.
- **.npmrc considerations** — `node-linker=hoisted` may be needed for Expo in S06. For S01, default pnpm strict linking is fine. Document the potential change.
- **Turbo 2.x** — uses `tasks` key (not legacy `pipeline`). Schema at `https://turborepo.dev/schema.json`.

## Common Pitfalls

- **ESLint flat config in monorepo** — Each package needs its own `eslint.config.mjs` that imports from `@repo/eslint-config`. The shared config must export config arrays/objects, not a full config file. Use `tseslint.config()` helper for composability.
- **TypeScript `composite` and `references`** — Don't use project references for this template. They add complexity without benefit when Turborepo handles build ordering. Use simple `extends` from shared configs.
- **`turbo.json` dev task** — Must set `cache: false` and `persistent: true`, otherwise Turbo will try to cache dev server output or consider it "done" immediately.
- **`check-types` depends on `^build`** — Internal packages must be built first so their types are available. Use `dependsOn: ["^build"]`.
- **pnpm catalog protocol** — Dependencies using `catalog:` in `package.json` resolve at install time. Useful for keeping TypeScript, ESLint versions aligned. But don't over-use — only for genuinely shared deps.
- **`.turbo/` directory** — Turbo creates cache dirs in each package. Add `.turbo` to root `.gitignore`.

## Open Risks

- **`.npmrc` `node-linker=hoisted`** — S06 (Expo) may require this, which changes pnpm's default strict isolation. This affects all packages, not just Expo. Decision deferred to S06, but we should keep `.npmrc` minimal in S01 so it's easy to add later.
- **ESLint 10 migration** — When React plugins catch up, the template will need updating. Not a blocker, just a lifecycle concern. Document ESLint 9 choice.
- **`eslint-config-prettier` version** — v10.1.8 requires `eslint-config-prettier >= 7.0.0 <10.0.0 || >=10.1.0` as peer when used with `eslint-plugin-prettier`. We'll use `eslint-config-prettier` standalone (not the plugin), which has simpler compat.

## Version Matrix

| Package | Version | Notes |
|---------|---------|-------|
| turbo | ^2.8.16 | devDependency at root |
| typescript | ~5.9.3 | catalog, all packages |
| eslint | ^9.39.4 | catalog, ESLint 10 blocked by React plugin compat |
| @eslint/js | ^9.0.0 | matches ESLint 9.x |
| typescript-eslint | ^8.57.0 | supports ESLint 9 + TS 5.9 |
| prettier | ^3.8.1 | root devDependency |
| eslint-config-prettier | ^10.1.8 | disables formatting rules |
| eslint-plugin-turbo | ^2.8.16 | Turborepo-specific lint rules |
| pnpm | >=10.0.0 | specified in `packageManager` field |

## Package Structure (S01 deliverables)

```
├── apps/                          (empty dirs, placeholders)
│   ├── honojs/
│   ├── nestjs/
│   ├── nextjs/
│   └── react-native/
├── packages/
│   ├── typescript-config/
│   │   ├── package.json           (@repo/typescript-config)
│   │   ├── base.json              (strict TS base)
│   │   ├── node.json              (extends base, Node targets)
│   │   ├── react.json             (extends base, JSX + React)
│   │   └── nextjs.json            (extends react, Next.js paths)
│   └── eslint-config/
│       ├── package.json           (@repo/eslint-config)
│       └── index.mjs              (flat config export)
├── .gitignore
├── .npmrc
├── .prettierrc
├── .prettierignore
├── package.json                   (root workspace scripts)
├── pnpm-workspace.yaml            (workspace globs + catalog)
└── turbo.json                     (task pipeline)
```

## Skills Discovered

| Technology | Skill | Status |
|------------|-------|--------|
| Turborepo | `vercel/turborepo@turborepo` (10.4K installs) | available — recommended |
| Monorepo management | `wshobson/agents@monorepo-management` (4.3K installs) | available |
| ESLint flat config | `mcollina/skills@linting-neostandard-eslint9` (121 installs) | available — niche |
| Turborepo caching | `wshobson/agents@turborepo-caching` (2.7K installs) | available — not needed for S01 |

The `vercel/turborepo@turborepo` skill (10.4K installs) is the most relevant. Consider installing it for implementation phases.

## Sources

- Turborepo task configuration and workspace structure (source: Context7 `/vercel/turborepo`)
- ESLint flat config with typescript-eslint (source: Context7 `/typescript-eslint/typescript-eslint`)
- pnpm workspace and catalog configuration (source: Context7 `/pnpm/pnpm.io`)
- ESLint plugin peer dependency compatibility checked via `npm view` for eslint-plugin-react, eslint-plugin-react-hooks, typescript-eslint
- Package versions verified via npm registry: turbo 2.8.16, eslint 9.39.4 (latest 9.x), typescript 5.9.3, typescript-eslint 8.57.0
