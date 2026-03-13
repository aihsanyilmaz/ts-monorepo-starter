# @repo/nextjs

> 🇬🇧 [English](./README.md)

[Next.js](https://nextjs.org/) 16, [Tailwind CSS](https://tailwindcss.com/) v4 ve [shadcn/ui](https://ui.shadcn.com/) ile oluşturulmuş web uygulaması.

## Teknoloji Yığını

- **Next.js 16** — SSR/SSG destekli React framework
- **Tailwind CSS v4** — CSS-öncelikli yapılandırma (`tailwind.config.js` dosyası yok)
- **shadcn/ui** — erişilebilir bileşen kütüphanesi (bileşenler `src/components/ui/` içinde)
- **@tanstack/react-query** — veri çekme ve sunucu durumu yönetimi
- **@repo/api-client** — tip-güvenli Hono RPC istemcisi
- **@repo/env** — ortam değişkeni doğrulama (`@t3-oss/env-nextjs` ile)
- **@repo/shared** — paylaşılan Zod şemaları ve tipler

## Betikler

| Betik | Açıklama |
|-------|----------|
| `pnpm dev` | Next.js geliştirme sunucusunu başlat |
| `pnpm build` | Üretim derlemesi oluştur |
| `pnpm start` | Üretim derlemesini sun |
| `pnpm lint` | ESLint çalıştır |
| `pnpm check-types` | `tsc --noEmit` ile tip kontrolü yap |

## Ortam Değişkenleri

Örnek dosyayı kopyalayıp gerektiği gibi düzenleyin:

```sh
cp .env.example .env
```

| Değişken | Açıklama | Varsayılan |
|----------|----------|------------|
| `NEXT_PUBLIC_API_URL` | Hono API sunucusunun URL'i | `http://localhost:3001` |
| `NODE_ENV` | `development` \| `production` \| `test` | `development` |

Tam doğrulama şeması için [`src/env.ts`](src/env.ts) dosyasına bakın. `NEXT_PUBLIC_` ön eki zorunluluğu ve istemci/sunucu ayrımı için `@t3-oss/env-nextjs` kullanır.

## Kullanım

```sh
# 3000 portunda geliştirme sunucusunu başlat
pnpm dev

# Üretim derlemesi oluştur ve sun
pnpm build
pnpm start
```

## Notlar

- Tailwind v4 CSS-öncelikli yapılandırma kullanır — tema özelleştirmesi bir JS yapılandırma dosyası yerine CSS içinde `@theme` ile yapılır.
- shadcn/ui bileşenleri paylaşılan bir pakette değil, bu uygulamaya özeldir (`src/components/ui/` içinde).

## Docker

Dockerfile, Next.js standalone çıktısı ile çok aşamalı bir derleme kullanır ve **monorepo kök dizininden** derlenmelidir:

```bash
# Üretim imajı oluştur (NEXT_PUBLIC_API_URL derleme sırasında istemci paketine gömülür)
docker build -f apps/nextjs/Dockerfile -t repo-nextjs --build-arg NEXT_PUBLIC_API_URL=http://localhost:3001 .

# Çalıştır
docker run -p 3000:3000 -e HOSTNAME=0.0.0.0 -e NODE_ENV=production repo-nextjs
```

Veya repo kök dizininden docker-compose kullanın:

```bash
# Geliştirme (volume bağlantıları ile anlık yenileme)
pnpm docker:dev

# Üretim
pnpm docker:prod
```

Üretim imaj boyutu: **~74 MB** (node:22-alpine tabanı, standalone çıktı).

> **Not:** `next.config.ts` içindeki `output: 'standalone'` ayarı, Next.js'in yalnızca üretim için gerekli olanları paketlemesini sağlayarak minimal bir Docker imajı üretir.

## Port

Varsayılan: **3000** (Next.js varsayılanı)
