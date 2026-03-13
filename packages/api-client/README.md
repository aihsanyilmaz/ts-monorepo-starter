# @repo/api-client

Type-safe HTTP client for the Hono API, powered by [Hono RPC](https://hono.dev/docs/guides/rpc).

## Exports

```ts
import { createApiClient, type AppType } from '@repo/api-client';
```

- **`createApiClient(baseUrl)`** — creates a typed Hono RPC client. Returns a client with full route inference from the Hono app's `AppType`.
- **`AppType`** — re-exported type from `@repo/honojs` representing the API's route structure.

## Usage

```ts
import { createApiClient } from '@repo/api-client';

const api = createApiClient('http://localhost:3001');

// Fully typed — routes, params, request bodies, and responses
const res = await api.users.$get();
const data = await res.json();
```

## How It Works

This package imports `AppType` from `@repo/honojs` as a workspace dependency (type-only at runtime). Hono's `hc` client uses this type to infer all available routes and their request/response shapes — no code generation needed.

The Turborepo pipeline ensures `@repo/honojs` builds first via the `^build` dependency.

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm build` | Build with `tsup` |
| `pnpm dev` | Build in watch mode |
| `pnpm lint` | Run ESLint |
| `pnpm check-types` | Type-check with `tsc --noEmit` |
