# @repo/nestjs

> 🇬🇧 [English](./README.md)

[NestJS](https://nestjs.com/) ile oluşturulmuş kurumsal düzeyde REST API sunucusu.

## Teknoloji Yığını

- **NestJS** — bağımlılık enjeksiyonlu modüler Node.js framework'ü
- **@swc-node/register** — geliştirme modu için SWC tabanlı TypeScript yükleyici (dekoratör meta verilerini korur)
- **Drizzle ORM** — tip güvenli veritabanı erişimi (`@repo/db` üzerinden SQLite)
- **class-validator / class-transformer** — DTO doğrulama ve dönüştürme
- **@repo/env** — ortam değişkeni doğrulama
- **@repo/shared** — paylaşılan Zod şemaları ve türler

## Betikler

| Betik | Açıklama |
|-------|----------|
| `pnpm dev` | `node --watch` + SWC register ile geliştirme sunucusunu başlat |
| `pnpm build` | `tsc` ile derle (dekoratör meta verilerini korur) |
| `pnpm start` | Derlenmiş üretim yapısını çalıştır (`node dist/main.js`) |
| `pnpm lint` | ESLint çalıştır |
| `pnpm check-types` | `tsc --noEmit` ile tür kontrolü yap |

## Ortam Değişkenleri

Örnek dosyayı kopyalayın ve gerektiği gibi düzenleyin:

```sh
cp .env.example .env
```

| Değişken | Açıklama | Varsayılan |
|----------|----------|------------|
| `PORT` | Sunucu portu | `3002` |
| `NODE_ENV` | `development` \| `production` \| `test` | `development` |
| `DATABASE_URL` | SQLite veritabanı dosya yolu | `./data/dev.db` |

Tam doğrulama şeması için [`src/env.ts`](src/env.ts) dosyasına bakın.

## Kullanım

```sh
# 3002 portunda geliştirme sunucusunu başlat
pnpm dev

# Üretim için derle ve çalıştır
pnpm build
pnpm start
```

## Notlar

- Geliştirme modu `@swc-node/register/esm-register` kullanır çünkü esbuild/tsx, NestJS DI'ın gerektirdiği dekoratör meta verilerini üretemez.
- Üretim derlemesi aynı nedenle `tsc` kullanır (tsup değil) — tsup'ın esbuild arka ucu dekoratör meta verilerini siler.

## Docker

Dockerfile çok aşamalı bir yapı kullanır (base → deps → build → production) ve **monorepo kök dizininden** oluşturulmalıdır:

```bash
# Üretim imajını oluştur
docker build -f apps/nestjs/Dockerfile -t repo-nestjs .

# Çalıştır
docker run -p 3002:3002 -e PORT=3002 -e NODE_ENV=production -e DATABASE_URL=./data/prod.db repo-nestjs
```

Veya repo kök dizininden docker-compose kullanın:

```bash
# Geliştirme (volume mount'lar ile hot-reload)
pnpm docker:dev

# Üretim
pnpm docker:prod
```

Üretim imaj boyutu: **~108 MB** (node:22-alpine tabanı).

## Port

Varsayılan: **3002** (3000'deki Next.js ve 3001'deki Hono ile çakışmayı önler)
