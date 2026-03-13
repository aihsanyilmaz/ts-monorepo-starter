# @repo/react-native

> 🇹🇷 [Türkçe](./README.tr.md)

Cross-platform mobile and web app built with [Expo](https://expo.dev/) (React Native) and [Expo Router](https://docs.expo.dev/router/introduction/).

## Tech Stack

- **Expo SDK 55** — managed React Native workflow
- **Expo Router** — file-based routing
- **React Native Web** — web output support
- **@tanstack/react-query** — data fetching and server state
- **@repo/api-client** — type-safe Hono RPC client
- **@repo/env** — environment variable validation (via `@t3-oss/env-core` with `EXPO_PUBLIC_` prefix)
- **@repo/shared** — shared Zod schemas and types

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start Expo dev server for web (`expo start --web`) |
| `pnpm build` | Export for web (`expo export --platform web`) |
| `pnpm lint` | Run ESLint |
| `pnpm check-types` | Type-check with `tsc --noEmit` |

## Environment Variables

Copy the example file and adjust as needed:

```sh
cp .env.example .env
```

| Variable | Description | Default |
|----------|-------------|---------|
| `EXPO_PUBLIC_API_URL` | URL of the Hono API server | `http://localhost:3001` |

See [`src/env.ts`](src/env.ts) for the full validation schema. Uses `@t3-oss/env-core` with `clientPrefix: "EXPO_PUBLIC_"` for Expo's environment variable convention.

## Usage

```sh
# Start Expo web dev server on port 8081
pnpm dev

# Export web build
pnpm build
```

## Notes

- TypeScript config extends `expo/tsconfig.base` (not `@repo/typescript-config/react.json`) because Metro requires `jsx: "react-native"` and other Expo-specific settings.
- The `main` field is set to `expo-router/entry` for file-based routing.

## Port

Default: **8081** (Expo default; no collision with Next.js, Hono, or NestJS)
