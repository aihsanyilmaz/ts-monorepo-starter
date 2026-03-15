# @repo/react-native

> 🇬🇧 [English](./README.md)

[Expo](https://expo.dev/) SDK ile çapraz platform mobil uygulama.

## Teknoloji

- **Expo SDK 55** — Expo Router ile managed workflow
- **React Native** — iOS, Android ve Web
- **TanStack Query** — veri çekme ve önbellekleme
- **Hono RPC istemcisi** — tip güvenli API çağrıları (`@repo/honojs`'den `AppType` import eder)
- **t3-env** — fail-fast ortam değişkeni doğrulama

## Scriptler

| Script | Açıklama |
|--------|----------|
| `pnpm dev` | Expo dev sunucusunu başlat (web modu) |
| `pnpm build` | Web bundle export et |

## Ortam Değişkenleri

| Değişken | Varsayılan | Açıklama |
|----------|------------|----------|
| `EXPO_PUBLIC_API_URL` | `http://localhost:3001` | Hono API base URL |

## Port

Varsayılan: **8081**
