# @repo/shared

Shared Zod schemas and TypeScript types used across apps. This package is intentionally independent of `@repo/db` to prevent circular dependencies.

## Exports

```ts
import { UserSchema, type User, ApiResponseSchema, type ApiResponse } from '@repo/shared';
```

### `UserSchema` / `User`

Zod schema and inferred type for a user object:

```ts
{
  id: string;
  name: string;       // min 1 char
  email: string;      // valid email
  createdAt: string;  // ISO datetime
}
```

### `ApiResponseSchema` / `ApiResponse`

Generic API response wrapper. `ApiResponseSchema` is a factory that takes a Zod data schema:

```ts
const ResponseSchema = ApiResponseSchema(UserSchema);

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: { code: string; message: string };
};
```

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm build` | Build with `tsup` |
| `pnpm dev` | Build in watch mode |
| `pnpm lint` | Run ESLint |
| `pnpm check-types` | Type-check with `tsc --noEmit` |
