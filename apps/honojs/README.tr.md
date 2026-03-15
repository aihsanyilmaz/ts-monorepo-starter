# @repo/honojs

> 🇬🇧 [English](./README.md)

[Hono](https://hono.dev/) + SQLite + Drizzle ORM ile REST API sunucusu.

## Teknoloji

- **Hono** — tipli RPC export'ları ile hızlı, hafif web framework
- **Drizzle ORM** — tip güvenli veritabanı erişimi (SQLite)
- **Zod** — `@hono/zod-validator` ile istek doğrulama
- **t3-env** — fail-fast ortam değişkeni doğrulama

## Veritabanı

Schema, config ve migration'lar bu uygulama içinde bağımsızdır:

```
src/db/schema.ts      # Drizzle şeması (tablolar)
drizzle.config.ts     # Drizzle Kit config
drizzle/              # Oluşturulan migration dosyaları
```

Migration'lar başlangıçta otomatik çalışır. Schema değiştirdikten sonra:

```bash
pnpm db:generate    # Schema diff'inden migration oluştur
pnpm db:studio      # Drizzle Studio'yu aç
```

## Scriptler

| Script | Açıklama |
|--------|----------|
| `pnpm dev` | Hot reload ile dev sunucusu başlat (`tsx watch`) |
| `pnpm build` | Production için derle (`tsup`) |
| `pnpm db:generate` | Drizzle migration oluştur |
| `pnpm db:studio` | Drizzle Studio'yu aç |

## Ortam Değişkenleri

| Değişken | Varsayılan | Açıklama |
|----------|------------|----------|
| `PORT` | `3001` | Sunucu portu |
| `NODE_ENV` | `development` | Ortam |
| `DATABASE_URL` | `./data/dev.db` | SQLite dosya yolu |

## Tip Export'ları

Bu uygulama `AppType` export eder — tüm Hono route'larının çıkarılmış tipi. Frontend uygulamalar bunu `hono/client` ile tam tipli API istemcisi oluşturmak için import eder:

```ts
import type { AppType } from '@repo/honojs';
import { hc } from 'hono/client';

const client = hc<AppType>('http://localhost:3001');
const res = await client.api.users.$get(); // tam tipli
```
