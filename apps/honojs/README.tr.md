# @repo/honojs

> 🇬🇧 [English](./README.md)

[Hono](https://hono.dev/) ve `@hono/node-server` adaptörü ile oluşturulmuş hafif REST API sunucusu.

## Teknoloji Yığını

- **Hono** — hızlı, hafif web çatısı
- **@hono/node-server** — Hono için Node.js adaptörü
- **@hono/zod-validator** — Zod ile istek doğrulama
- **Drizzle ORM** — tür güvenli veritabanı erişimi (`@repo/db` üzerinden SQLite)
- **@repo/env** — ortam değişkeni doğrulama
- **@repo/shared** — paylaşılan Zod şemaları ve türler

## Betikler

| Betik | Açıklama |
|-------|----------|
| `pnpm dev` | Geliştirme sunucusunu hot reload ile başlat (`tsx watch`) |
| `pnpm build` | Üretim için derle (`tsup`) |
| `pnpm lint` | ESLint çalıştır |
| `pnpm check-types` | `tsc --noEmit` ile tür denetimi yap |

## Ortam Değişkenleri

Örnek dosyayı kopyalayın ve gerektiği gibi düzenleyin:

```sh
cp .env.example .env
```

| Değişken | Açıklama | Varsayılan |
|----------|----------|------------|
| `PORT` | Sunucu portu | `3001` |
| `NODE_ENV` | `development` \| `production` \| `test` | `development` |
| `DATABASE_URL` | SQLite veritabanı dosya yolu | `./data/dev.db` |

Tam doğrulama şeması için [`src/env.ts`](src/env.ts) dosyasına bakın.

## Kullanım

```sh
# Geliştirme sunucusunu 3001 portunda başlat
pnpm dev

# Üretim paketini derle ve çalıştır
pnpm build
node dist/index.js
```

API, `AppType` türünü `@repo/api-client` tarafından kullanılmak üzere dışa aktarır ve Next.js ile Expo uygulamalarında uçtan uca tür güvenli RPC istemcileri oluşturmayı sağlar.

## Docker

Dockerfile çok aşamalı bir derleme (base → deps → build → production) kullanır ve **monorepo kök dizininden** derlenmelidir:

```bash
# Üretim imajını derle
docker build -f apps/honojs/Dockerfile -t repo-honojs .

# Çalıştır
docker run -p 3001:3001 -e PORT=3001 -e NODE_ENV=production -e DATABASE_URL=./data/prod.db repo-honojs
```

Veya repo kök dizininden docker-compose kullanın:

```bash
# Geliştirme (volume mount ile hot-reload)
pnpm docker:dev

# Üretim
pnpm docker:prod
```

Üretim imaj boyutu: **~101 MB** (node:22-alpine tabanı).

## Port

Varsayılan: **3001** (3000 portundaki Next.js ile çakışmayı önler)
