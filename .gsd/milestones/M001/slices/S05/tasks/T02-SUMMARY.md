---
id: T02
parent: S05
milestone: M001
provides:
  - Tailwind CSS v4 with CSS-first config (no tailwind.config.js) via @tailwindcss/postcss
  - shadcn/ui Button and Card components with monorepo alias resolution
  - cn() utility (clsx + tailwind-merge) at src/lib/utils.ts
  - shadcn/ui theme variables (oklch, light+dark) in globals.css
  - components.json configured for future shadcn/ui component generation
key_files:
  - apps/nextjs/postcss.config.mjs
  - apps/nextjs/src/app/globals.css
  - apps/nextjs/src/lib/utils.ts
  - apps/nextjs/components.json
  - apps/nextjs/src/components/ui/button.tsx
  - apps/nextjs/src/components/ui/card.tsx
key_decisions:
  - Used shadcn CLI (npx shadcn@latest) successfully in monorepo — no manual component creation needed
  - Installed shadcn, class-variance-authority, tw-animate-css, lucide-react, radix-ui as shadcn v4 deps
patterns_established:
  - shadcn/ui component generation via `npx shadcn@latest add <component>` from apps/nextjs directory
  - Tailwind v4 CSS-first theming with @import "tailwindcss" + @theme inline block + oklch color variables
  - shadcn/ui dark mode via @custom-variant dark (&:is(.dark *))
observability_surfaces:
  - none
duration: ~10m
verification_result: passed
completed_at: 2026-03-13
blocker_discovered: false
---

# T02: Set up Tailwind CSS v4 + shadcn/ui components

**Configured Tailwind CSS v4 with CSS-first approach and generated shadcn/ui Button + Card components via CLI**

## What Happened

Installed tailwindcss@4, @tailwindcss/postcss, clsx, tailwind-merge, tw-animate-css, shadcn, class-variance-authority, and lucide-react. Created PostCSS config with @tailwindcss/postcss plugin. Created globals.css with the full shadcn/ui v4 theme (oklch colors, light/dark modes, @theme inline block mapping CSS vars to Tailwind color tokens). Created cn() utility in src/lib/utils.ts. Added globals.css import to layout.tsx.

Created components.json with new-york style, correct monorepo aliases (@/components, @/lib/utils, @/components/ui). Then ran `npx shadcn@latest add button card` — the CLI worked cleanly in the monorepo context, generating both components with correct imports. The CLI also pulled in radix-ui as a dependency (Button uses Slot from it).

## Verification

- `pnpm build --filter @repo/nextjs` — exits 0 (Next.js 16.1.6 Turbopack, compiled successfully)
- `pnpm check-types --filter @repo/nextjs` — exits 0
- `pnpm lint --filter @repo/nextjs` — exits 0
- `apps/nextjs/src/components/ui/button.tsx` exists, exports Button and buttonVariants
- `apps/nextjs/src/components/ui/card.tsx` exists, exports Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent
- `apps/nextjs/src/app/globals.css` contains `@import "tailwindcss"` and `@theme inline` block
- No tailwind.config.js/ts present (CSS-first confirmed)
- `src/lib/utils.ts` exports cn() function

### Slice-level checks (this task):
- ✅ `pnpm build --filter @repo/nextjs` exits 0
- ✅ `pnpm lint --filter @repo/nextjs` exits 0
- ✅ `pnpm check-types --filter @repo/nextjs` exits 0
- ⏳ Dev server + curl — deferred to T03 (demo page needed)
- ⏳ shadcn/ui component rendering verification — deferred to T03 (demo page needed)

## Diagnostics

None — styling infrastructure has no runtime diagnostics. Build failure is the primary signal for CSS/component issues.

## Deviations

- Task plan mentioned trying shadcn CLI first with manual fallback — CLI worked on first attempt, no manual component creation needed
- Additional dependencies installed beyond plan: `shadcn`, `class-variance-authority`, `tw-animate-css`, `lucide-react`, `radix-ui` (required by shadcn/ui v4 components)

## Known Issues

None

## Files Created/Modified

- `apps/nextjs/postcss.config.mjs` — PostCSS config with @tailwindcss/postcss plugin
- `apps/nextjs/src/app/globals.css` — Tailwind v4 imports + shadcn/ui theme variables (oklch, light/dark)
- `apps/nextjs/src/lib/utils.ts` — cn() utility (clsx + tailwind-merge)
- `apps/nextjs/components.json` — shadcn/ui config with monorepo aliases
- `apps/nextjs/src/components/ui/button.tsx` — shadcn Button component (generated via CLI)
- `apps/nextjs/src/components/ui/card.tsx` — shadcn Card component (generated via CLI)
- `apps/nextjs/src/app/layout.tsx` — added globals.css import
- `apps/nextjs/package.json` — added tailwindcss, @tailwindcss/postcss, clsx, tailwind-merge, tw-animate-css, shadcn, class-variance-authority, lucide-react, radix-ui
