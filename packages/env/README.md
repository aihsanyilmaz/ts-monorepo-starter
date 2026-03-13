# @repo/env

Centralized environment variable validation for the monorepo. Re-exports `createEnv` from `@t3-oss/env-core` and `z` from Zod so that apps have a single import for env validation.

## Exports

```ts
import { createEnv, z } from '@repo/env';
```

- **`createEnv`** — typed env validation factory from `@t3-oss/env-core`
- **`z`** — Zod schema builder (re-exported for convenience)

## Usage

Each app creates its own validated env object:

```ts
// apps/honojs/src/env.ts
import { createEnv, z } from '@repo/env';

export const env = createEnv({
  server: {
    PORT: z.coerce.number().default(3001),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    DATABASE_URL: z.string().default('./data/dev.db'),
  },
  runtimeEnv: process.env,
});
```

> **Note:** The Next.js app uses `@t3-oss/env-nextjs` directly (not this package) because it needs `NEXT_PUBLIC_` prefix enforcement and client/server separation.

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm build` | Build with `tsup` |
| `pnpm dev` | Build in watch mode |
| `pnpm lint` | Run ESLint |
| `pnpm check-types` | Type-check with `tsc --noEmit` |
