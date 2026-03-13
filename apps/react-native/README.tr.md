# @repo/react-native

> 🇬🇧 [English](./README.md)

[Expo](https://expo.dev/) (React Native) ve [Expo Router](https://docs.expo.dev/router/introduction/) ile geliştirilmiş çoklu platform mobil ve web uygulaması.

## Teknoloji Yığını

- **Expo SDK 55** — yönetilen React Native iş akışı
- **Expo Router** — dosya tabanlı yönlendirme
- **React Native Web** — web çıktısı desteği
- **@tanstack/react-query** — veri çekme ve sunucu durumu yönetimi
- **@repo/api-client** — tip güvenli Hono RPC istemcisi
- **@repo/env** — ortam değişkeni doğrulama (`@t3-oss/env-core` ile `EXPO_PUBLIC_` ön eki)
- **@repo/shared** — paylaşımlı Zod şemaları ve tipler

## Betikler

| Betik | Açıklama |
|-------|----------|
| `pnpm dev` | Web için Expo geliştirme sunucusunu başlat (`expo start --web`) |
| `pnpm build` | Web için dışa aktar (`expo export --platform web`) |
| `pnpm lint` | ESLint çalıştır |
| `pnpm check-types` | `tsc --noEmit` ile tip kontrolü yap |

## Ortam Değişkenleri

Örnek dosyayı kopyalayıp ihtiyacınıza göre düzenleyin:

```sh
cp .env.example .env
```

| Değişken | Açıklama | Varsayılan |
|----------|----------|------------|
| `EXPO_PUBLIC_API_URL` | Hono API sunucusunun URL'i | `http://localhost:3001` |

Tam doğrulama şeması için [`src/env.ts`](src/env.ts) dosyasına bakın. Expo'nun ortam değişkeni kurallarına uygun şekilde `@t3-oss/env-core` üzerinden `clientPrefix: "EXPO_PUBLIC_"` kullanır.

## Kullanım

```sh
# Expo web geliştirme sunucusunu 8081 portunda başlat
pnpm dev

# Web build'ini dışa aktar
pnpm build
```

## Notlar

- TypeScript yapılandırması `expo/tsconfig.base` dosyasını genişletir (`@repo/typescript-config/react.json` değil), çünkü Metro `jsx: "react-native"` ve diğer Expo'ya özel ayarları gerektirir.
- Dosya tabanlı yönlendirme için `main` alanı `expo-router/entry` olarak ayarlanmıştır.

## Port

Varsayılan: **8081** (Expo varsayılanı; Next.js, Hono veya NestJS ile çakışmaz)
