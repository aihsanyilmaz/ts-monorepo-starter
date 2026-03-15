# @repo/nextjs

> 🇬🇧 [English](./README.md)

[Next.js](https://nextjs.org/) + Tailwind CSS v4 + shadcn/ui ile web uygulaması.

## Teknoloji

- **Next.js 16** — App Router ile React framework
- **Tailwind CSS v4** — CSS-first yapılandırma
- **shadcn/ui** — erişilebilir UI bileşenleri
- **TanStack Query** — veri çekme ve önbellekleme
- **Hono RPC istemcisi** — tip güvenli API çağrıları (`@repo/honojs`'den `AppType` import eder)
- **t3-env** — fail-fast ortam değişkeni doğrulama

## Scriptler

| Script | Açıklama |
|--------|----------|
| `pnpm dev` | Hot reload ile dev sunucusu başlat |
| `pnpm build` | Production için derle |
| `pnpm start` | Production sunucusunu başlat |

## Ortam Değişkenleri

| Değişken | Varsayılan | Açıklama |
|----------|------------|----------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:3001` | Hono API base URL |

## Port

Varsayılan: **3000**
