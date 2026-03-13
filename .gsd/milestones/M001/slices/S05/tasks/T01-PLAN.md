---
estimated_steps: 7
estimated_files: 8
---

# T01: Scaffold Next.js app with config, env, and ESLint

**Slice:** S05 — Next.js Web App
**Milestone:** M001

## Description

Create the foundational Next.js 16 App Router application at `apps/nextjs`. This includes package.json with correct dependencies, tsconfig extending the monorepo's nextjs base, next.config.ts with `transpilePackages` for workspace packages, env validation via `@t3-oss/env-nextjs`, ESLint config with React/Next.js plugins, and minimal app shell (layout + page). After this task, the app compiles, lints, and type-checks cleanly — but has no styling or data fetching yet.

## Steps

1. Remove `apps/nextjs/.gitkeep`. Create `apps/nextjs/package.json` with:
   - `name: "@repo/nextjs"`, `private: true`, `type: "module"`
   - Dependencies: `next@^16.0.0`, `react@^19.0.0`, `react-dom@^19.0.0`, `@repo/api-client: workspace:*`, `@repo/env: workspace:*`, `@repo/shared: workspace:*`, `@t3-oss/env-nextjs`
   - Dev dependencies: `typescript` (catalog), `@types/react`, `@types/react-dom`, `@repo/typescript-config: workspace:*`, `@repo/eslint-config: workspace:*`, `eslint` (catalog), `eslint-plugin-react-hooks`, `@next/eslint-plugin-next`
   - Scripts: `dev`, `build`, `start`, `lint`, `check-types`

2. Create `apps/nextjs/tsconfig.json` extending `@repo/typescript-config/nextjs.json` with:
   - `paths: { "@/*": ["./src/*"] }` for monorepo aliases
   - `include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"]`
   - `exclude: ["node_modules"]`

3. Create `apps/nextjs/next.config.ts` with:
   - `transpilePackages: ["@repo/api-client", "@repo/env", "@repo/shared"]`
   - `outputFileTracingRoot` set to monorepo root (`path.join(import.meta.dirname, '../../')` or equivalent)

4. Create `apps/nextjs/src/env.ts` with `@t3-oss/env-nextjs`:
   - `client: { NEXT_PUBLIC_API_URL: z.string().url() }`
   - `server: { NODE_ENV: z.enum(["development", "production", "test"]).default("development") }`
   - `runtimeEnv` pulling from `process.env`
   - `emptyStringAsUndefined: true` (per t3-env best practice, to prevent empty `.env` entries from bypassing required validation)

5. Create `apps/nextjs/eslint.config.mjs`:
   - Import and spread `@repo/eslint-config`
   - Add `eslint-plugin-react-hooks` flat config
   - Add `@next/eslint-plugin-next` flat config rules
   - Ignore `.next/` directory

6. Create minimal `apps/nextjs/src/app/layout.tsx` (RootLayout with html/body, metadata export) and `apps/nextjs/src/app/page.tsx` (simple heading, no styling).

7. Create `apps/nextjs/.env.example` documenting `NEXT_PUBLIC_API_URL=http://localhost:3001` and create `apps/nextjs/.env` with same defaults for local dev. Run `pnpm install`, then verify `pnpm build --filter nextjs`, `pnpm lint --filter nextjs`, `pnpm check-types --filter nextjs` all pass.

## Must-Haves

- [ ] `package.json` has correct Next.js 16 + React 19 deps and workspace references
- [ ] `tsconfig.json` extends `@repo/typescript-config/nextjs.json` with `@/*` path alias
- [ ] `next.config.ts` has `transpilePackages` for all `@repo/*` workspace packages
- [ ] `src/env.ts` validates `NEXT_PUBLIC_API_URL` and `NODE_ENV` via `@t3-oss/env-nextjs`
- [ ] ESLint config extends shared config with React hooks and Next.js rules
- [ ] `pnpm build --filter nextjs` exits 0
- [ ] `pnpm lint --filter nextjs` exits 0
- [ ] `pnpm check-types --filter nextjs` exits 0

## Verification

- `pnpm install` resolves without errors
- `pnpm build --filter nextjs` exits 0 (produces `.next/` output)
- `pnpm lint --filter nextjs` exits 0
- `pnpm check-types --filter nextjs` exits 0
- `apps/nextjs/.env.example` exists with documented variables

## Inputs

- `packages/typescript-config/nextjs.json` — tsconfig base to extend
- `packages/eslint-config/index.mjs` — shared ESLint config to extend
- `packages/env/src/index.ts` — re-exports `createEnv` and `z` (but this task uses `@t3-oss/env-nextjs` directly for NEXT_PUBLIC_ support)
- `apps/honojs/src/env.ts` — reference pattern for env validation shape
- `apps/honojs/eslint.config.mjs` — reference pattern for ESLint config (simpler version)

## Expected Output

- `apps/nextjs/package.json` — full dependency manifest
- `apps/nextjs/tsconfig.json` — TypeScript config with path aliases
- `apps/nextjs/next.config.ts` — Next.js config with transpilePackages
- `apps/nextjs/src/env.ts` — Zod env validation for Next.js
- `apps/nextjs/eslint.config.mjs` — ESLint flat config with React/Next.js rules
- `apps/nextjs/src/app/layout.tsx` — root layout (minimal, no styling)
- `apps/nextjs/src/app/page.tsx` — home page (minimal, no styling)
- `apps/nextjs/.env.example` — documented env vars
