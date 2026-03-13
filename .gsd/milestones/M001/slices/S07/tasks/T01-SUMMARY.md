---
id: T01
parent: S07
milestone: M001
provides:
  - .env.example files for honojs and nestjs apps
  - Next.js build caching via turbo.json per-app output override
key_files:
  - apps/honojs/.env.example
  - apps/nestjs/.env.example
  - turbo.json
key_decisions:
  - Used apps/nextjs#build per-package task override in turbo.json rather than changing the global build outputs
patterns_established:
  - .env.example format for backend apps: PORT, NODE_ENV, DATABASE_URL with comments
observability_surfaces:
  - none
duration: 3 min
verification_result: passed
completed_at: 2026-03-13
blocker_discovered: false
---

# T01: Add missing .env.example files and fix turbo.json outputs

**Created .env.example for honojs (PORT=3001) and nestjs (PORT=3002), added per-app Next.js build output config to turbo.json enabling Turbo cache for .next/**

## What Happened

Created two `.env.example` files with PORT, NODE_ENV, and DATABASE_URL sourced from each app's `env.ts` defaults. Updated `turbo.json` with an `apps/nextjs#build` per-package task override specifying `.next/**` outputs (excluding `.next/cache/**`). Verified the Next.js build caching works — second `pnpm build` hit `FULL TURBO` with all 8 tasks cached.

## Verification

- `cat apps/honojs/.env.example` — shows PORT=3001, NODE_ENV=development, DATABASE_URL=./data/dev.db ✓
- `cat apps/nestjs/.env.example` — shows PORT=3002, NODE_ENV=development, DATABASE_URL=./data/dev.db ✓
- `grep -A2 'nextjs#build' turbo.json` — shows .next/** output config ✓
- `pnpm build` — passes clean, second run hits FULL TURBO ✓
- Slice checks: .env.example files exist ✓, .next in turbo.json ✓, README count 1/11 (expected — README tasks are later)

## Diagnostics

None — these are static config files.

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `apps/honojs/.env.example` — new file documenting honojs env vars (PORT=3001)
- `apps/nestjs/.env.example` — new file documenting nestjs env vars (PORT=3002)
- `turbo.json` — added apps/nextjs#build per-package override with .next/** outputs
