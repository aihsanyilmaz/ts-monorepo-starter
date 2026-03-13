---
estimated_steps: 4
estimated_files: 10
---

# T02: Write per-app and per-package READMEs

**Slice:** S07 — Dokümantasyon & Final Polish
**Milestone:** M001

## Description

Write README.md for all 10 workspaces (4 apps + 6 packages). Each README should be concise and actionable — what it is, how to use it, available scripts, and env vars (for apps). All content must match actual `package.json` scripts and source files.

## Steps

1. Write READMEs for the 4 apps (`apps/honojs`, `apps/nestjs`, `apps/nextjs`, `apps/react-native`). Each includes: one-line description, tech stack, available scripts with descriptions, environment variables table referencing `.env.example`, port info, and a brief usage note. Reference decisions D020 (Hono port), D023/D024 (NestJS tooling), D025 (NestJS port), D027 (Next.js env), D029 (Tailwind v4), D032-D034 (Expo config) for accuracy.
2. Write READMEs for the 4 library packages (`packages/env`, `packages/db`, `packages/shared`, `packages/api-client`). Each includes: what it exports, how to import/use it in an app, available scripts, and notable design decisions (e.g. api-client's dependency on honojs AppType per D019).
3. Write READMEs for the 2 config packages (`packages/eslint-config`, `packages/typescript-config`). Each describes what configs are available and how other workspaces extend them.
4. Cross-check: verify every script mentioned in READMEs exists in the corresponding `package.json`, and every env var matches the corresponding `env.ts` file.

## Must-Haves

- [ ] All 4 app READMEs exist and document scripts, env vars, and ports
- [ ] All 6 package READMEs exist and document exports and usage
- [ ] Scripts in READMEs match actual `package.json` scripts
- [ ] Env vars in READMEs match actual `env.ts` schemas

## Verification

- `find . -path ./node_modules -prune -o -name 'README.md' -print | grep -v node_modules | wc -l` returns at least 10
- Spot-check: `grep 'pnpm dev' apps/honojs/README.md` returns a match
- Spot-check: `grep '3001' apps/honojs/README.md` returns a match
- Spot-check: `grep 'createApiClient' packages/api-client/README.md` returns a match

## Inputs

- All workspace `package.json` files — for script names
- All app `src/env.ts` files — for env var schemas
- `.env.example` files (all 4 after T01) — for env var documentation format
- Decision register — for port assignments, tooling choices

## Expected Output

- `apps/honojs/README.md` — app README with scripts, env vars, port 3001
- `apps/nestjs/README.md` — app README with scripts, env vars, port 3002
- `apps/nextjs/README.md` — app README with scripts, env vars, port 3000
- `apps/react-native/README.md` — app README with scripts, env vars, port 8081
- `packages/env/README.md` — createEnv usage docs
- `packages/db/README.md` — Drizzle schema, client factory, db scripts
- `packages/shared/README.md` — exported types and schemas
- `packages/api-client/README.md` — Hono RPC client usage, AppType dependency
- `packages/eslint-config/README.md` — available configs, how to extend
- `packages/typescript-config/README.md` — available tsconfig bases, how to extend
