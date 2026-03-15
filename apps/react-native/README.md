# @repo/react-native

> 🇹🇷 [Türkçe](./README.tr.md)

Cross-platform mobile app built with [Expo](https://expo.dev/) SDK.

## Tech Stack

- **Expo SDK 55** — managed workflow with Expo Router
- **React Native** — iOS, Android, and Web
- **TanStack Query** — data fetching and caching
- **Hono RPC client** — type-safe API calls (imports `AppType` from `@repo/honojs`)
- **t3-env** — fail-fast environment variable validation

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start Expo dev server (web mode) |
| `pnpm build` | Export web bundle |

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `EXPO_PUBLIC_API_URL` | `http://localhost:3001` | Hono API base URL |

## Port

Default: **8081**
