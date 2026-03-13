# Decisions Register

<!-- Append-only. Never edit or remove existing rows.
     To reverse a decision, add a new row that supersedes it.
     Read this file at the start of any planning or research phase. -->

| # | When | Scope | Decision | Choice | Rationale | Revisable? |
|---|------|-------|----------|--------|-----------|------------|
| D001 | M001 | arch | Package manager | pnpm | Turborepo's recommended companion, strict dependency resolution, workspace support | No |
| D002 | M001 | arch | Backend strategy | Pick-your-backend (HonoJS or NestJS) | Template users have different needs — lightweight vs enterprise | No |
| D003 | M001 | arch | UI sharing between web and mobile | No UI sharing — business logic only | shadcn/ui (web) and React Native components are incompatible; share types, schemas, hooks, API client instead | Yes — if react-native-web explored |
| D004 | M001 | data | Default database | SQLite (dev) + PostgreSQL adapter (prod) | Zero-config local dev, production-ready option available | Yes — if other DBs needed |
| D005 | M001 | arch | Env validation pattern | Zod base in packages/env, per-app derived schemas | Each app has different env needs but shares validation infrastructure | No |
| D006 | M001 | arch | API type safety | Hono RPC (when using HonoJS backend) | Zero-codegen type safety, built into Hono | No |
| D007 | M001 | arch | Web framework | Next.js + shadcn/ui | SSR/SSG/SEO for web; shadcn/ui for high-quality, customizable components | No |
| D008 | M001 | arch | Mobile framework | Expo (React Native) with web output | Cross-platform from single codebase, SDK 52+ automatic monorepo support | No |
| D009 | M001 | convention | App directory naming | apps/honojs, apps/nestjs, apps/nextjs, apps/react-native | Descriptive, framework-named directories | No |
| D010 | S01 | tooling | ESLint pinned to 9.x | ESLint ^9.39.4, not 10.x | eslint-plugin-react and eslint-plugin-react-hooks don't support ESLint 10 yet — blocks S05/S06 | Yes — when React plugins support ESLint 10 |
| D011 | S01 | convention | Workspace package scope | `@repo/` prefix | Turborepo convention, avoids npm name conflicts, clear internal-only signal | No |
| D012 | S01 | tooling | pnpm catalog for shared versions | Use `catalog:` protocol in pnpm-workspace.yaml | Single source of truth for TypeScript, ESLint, Prettier versions across all workspace packages | No |
| D013 | S01 | convention | eslint-config has no check-types | Skip tsc on pure-JS config packages | Package is .mjs only; checkJs flags third-party type mismatches that are not actionable. Lint covers correctness. | No |
