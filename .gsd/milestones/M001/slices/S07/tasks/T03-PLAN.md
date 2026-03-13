---
estimated_steps: 3
estimated_files: 1
---

# T03: Write root README and run final integration verification

**Slice:** S07 — Dokümantasyon & Final Polish
**Milestone:** M001

## Description

Write the root README.md — the template's front door. This is what users see on GitHub. It must answer "I cloned this, now what?" with a clear quick-start flow. Then run the full integration verification suite to confirm everything passes clean.

## Steps

1. Write `README.md` at project root with these sections:
   - Title, one-paragraph description, and tech stack badges/list
   - **Quick Start** — `git clone`, `pnpm install`, `cp .env.example .env` for frontend apps, `pnpm dev`, with expected port output
   - **Project Structure** — tree showing `apps/` and `packages/` with one-line descriptions
   - **Apps** — table or list of all 4 apps with name, framework, port, and brief description
   - **Packages** — table or list of all 6 packages with name and purpose
   - **Environment Variables** — explain the env validation pattern (Zod-based, fail-fast at startup), reference per-app `.env.example` files, note that backend apps have sensible defaults and work without `.env`
   - **Scripts** — root-level scripts (`pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm check-types`) and filtering (`pnpm dev --filter honojs`)
   - **Architecture Notes** — pnpm catalog for shared versions, Hono RPC type chain (api-client → honojs AppType), NestJS uses SWC for dev / tsc for build (D023/D024)
   - **License** — MIT or placeholder
2. Run full verification: `pnpm build`, `pnpm lint`, `pnpm check-types`.
3. Spot-check README accuracy: verify that referenced paths, scripts, and port numbers match the actual codebase. Check that all 10 workspace READMEs from T02 are in place.

## Must-Haves

- [ ] Root `README.md` exists with Quick Start, Project Structure, Apps, Packages, Environment Variables, Scripts sections
- [ ] Quick Start steps are accurate and complete (clone → install → env → dev)
- [ ] All port numbers match decisions (3000, 3001, 3002, 8081)
- [ ] `pnpm build` passes clean
- [ ] `pnpm lint` passes clean
- [ ] `pnpm check-types` passes clean
- [ ] All 11 README files exist (root + 10 workspaces)

## Verification

- `test -f README.md && echo "exists"` — root README exists
- `grep 'Quick Start\|Getting Started' README.md` — has quick-start section
- `grep '3001' README.md && grep '3002' README.md && grep '3000' README.md && grep '8081' README.md` — all ports documented
- `pnpm build && pnpm lint && pnpm check-types` — all pass
- `find . -path ./node_modules -prune -o -name 'README.md' -print | grep -v node_modules | wc -l` — returns 11

## Inputs

- All workspace READMEs from T02 — for consistency and cross-referencing
- `.env.example` files from T01 — for env documentation
- `turbo.json` — for script documentation
- Root `package.json` — for available scripts
- Decision register — for architectural notes

## Expected Output

- `README.md` — complete root README serving as the template's primary documentation
