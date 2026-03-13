---
estimated_steps: 5
estimated_files: 7
---

# T02: Set up Tailwind CSS v4 + shadcn/ui components

**Slice:** S05 — Next.js Web App
**Milestone:** M001

## Description

Install and configure Tailwind CSS v4 (CSS-first, no tailwind.config.js) and shadcn/ui with proper monorepo alias resolution. Generate Button and Card components. This is the riskiest part of S05 — shadcn/ui monorepo alias configuration and Tailwind v4 CSS variable theming are the most likely failure points.

## Steps

1. Install Tailwind CSS v4 and PostCSS deps: `tailwindcss@^4`, `@tailwindcss/postcss`. Create `apps/nextjs/postcss.config.mjs` with `@tailwindcss/postcss` plugin.

2. Create `apps/nextjs/src/app/globals.css` with:
   - `@import "tailwindcss"` at the top
   - shadcn/ui CSS custom properties via `@theme` block (colors, radius, etc.) following shadcn v4's Tailwind v4 format
   - Base layer styles for body, consistent with shadcn/ui default theme
   - Import globals.css in `layout.tsx`

3. Create `apps/nextjs/src/lib/utils.ts` with the standard shadcn `cn()` utility (using `clsx` + `tailwind-merge`). Install `clsx` and `tailwind-merge` as dependencies.

4. Try `npx shadcn@latest init` in `apps/nextjs` directory. If the CLI works in monorepo context, use it to set up `components.json`. If it creates issues (modifies root files, wrong paths), manually create `components.json` with:
   - `style: "new-york"`, `tsx: true`
   - Aliases: `components: "@/components"`, `utils: "@/lib/utils"`, `ui: "@/components/ui"`, `hooks: "@/hooks"`, `lib: "@/lib"`
   - CSS path pointing to `src/app/globals.css`

5. Add shadcn/ui Button and Card components. Try `npx shadcn@latest add button card` from `apps/nextjs`. If CLI fails, manually create the component files from shadcn source code, ensuring they import from `@/lib/utils` and use the correct Tailwind v4 class patterns. Verify `pnpm build --filter nextjs` still passes.

## Must-Haves

- [ ] Tailwind CSS v4 configured with CSS-first approach (no tailwind.config.js)
- [ ] `globals.css` has shadcn/ui theme variables compatible with Tailwind v4
- [ ] `cn()` utility function in `src/lib/utils.ts`
- [ ] `components.json` with correct monorepo aliases matching tsconfig paths
- [ ] Button component at `src/components/ui/button.tsx`
- [ ] Card component at `src/components/ui/card.tsx`
- [ ] `pnpm build --filter nextjs` still passes

## Verification

- `pnpm build --filter nextjs` exits 0
- `apps/nextjs/src/components/ui/button.tsx` exists and exports Button
- `apps/nextjs/src/components/ui/card.tsx` exists and exports Card/CardHeader/CardContent/etc.
- `apps/nextjs/src/app/globals.css` contains `@import "tailwindcss"` and theme variables
- `pnpm check-types --filter nextjs` exits 0

## Inputs

- T01 output — working Next.js app that compiles and type-checks
- `apps/nextjs/tsconfig.json` — path aliases must match `components.json` aliases
- `apps/nextjs/src/app/layout.tsx` — needs globals.css import added

## Expected Output

- `apps/nextjs/postcss.config.mjs` — PostCSS config with Tailwind v4 plugin
- `apps/nextjs/src/app/globals.css` — Tailwind v4 + shadcn/ui theme CSS
- `apps/nextjs/src/lib/utils.ts` — `cn()` utility
- `apps/nextjs/components.json` — shadcn/ui config with monorepo aliases
- `apps/nextjs/src/components/ui/button.tsx` — shadcn Button component
- `apps/nextjs/src/components/ui/card.tsx` — shadcn Card component
- `apps/nextjs/src/app/layout.tsx` — updated with globals.css import
