---
estimated_steps: 3
estimated_files: 3
---

# T01: Add missing .env.example files and fix turbo.json outputs

**Slice:** S07 — Dokümantasyon & Final Polish
**Milestone:** M001

## Description

Two backend apps (honojs, nestjs) are missing `.env.example` files. The turbo.json `build` task only specifies `dist/**` as outputs, but Next.js outputs to `.next/` — meaning Next.js builds are never cached by Turbo. Fix both issues.

## Steps

1. Create `apps/honojs/.env.example` following the existing format from `apps/nextjs/.env.example`. Include `PORT`, `NODE_ENV`, and `DATABASE_URL` with their default values from `apps/honojs/src/env.ts`.
2. Create `apps/nestjs/.env.example` with the same vars but `PORT=3002` per D025.
3. Update `turbo.json` to add per-task output overrides for the `build` task — the default `dist/**` stays, but add a Next.js-aware pattern. Use `apps/nextjs#build` key with `outputs: [".next/**", "!.next/cache/**"]` to cache Next.js build output while excluding the internal cache directory.

## Must-Haves

- [ ] `apps/honojs/.env.example` exists with PORT, NODE_ENV, DATABASE_URL
- [ ] `apps/nestjs/.env.example` exists with PORT, NODE_ENV, DATABASE_URL
- [ ] `turbo.json` includes `.next/**` in Next.js build outputs
- [ ] `pnpm build` passes clean after changes

## Verification

- `cat apps/honojs/.env.example` shows all three env vars
- `cat apps/nestjs/.env.example` shows all three env vars with PORT=3002
- `grep -A2 'nextjs#build' turbo.json` shows .next output config
- `pnpm build` completes without errors

## Inputs

- `apps/honojs/src/env.ts` — source of truth for honojs env vars
- `apps/nestjs/src/env.ts` — source of truth for nestjs env vars
- `apps/nextjs/.env.example` — existing format to follow
- `turbo.json` — current task configuration

## Expected Output

- `apps/honojs/.env.example` — new file documenting backend env vars
- `apps/nestjs/.env.example` — new file documenting backend env vars
- `turbo.json` — updated with per-app build output overrides for Next.js
