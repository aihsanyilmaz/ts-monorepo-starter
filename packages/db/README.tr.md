# @repo/db

> 🇬🇧 [English](./README.md)

[Drizzle ORM](https://orm.drizzle.team/) kullanan veritabanı paketi — **SQLite** ve **PostgreSQL** desteği, subpath export'lar ile.

## Export'lar

### Varsayılan / SQLite (`@repo/db` veya `@repo/db/sqlite`)

```ts
import { createDb, schema, users, posts } from '@repo/db';
// veya açıkça:
import { createDb, schema, users, posts } from '@repo/db/sqlite';
```

- **`createDb(url?)`** — Drizzle + better-sqlite3 instance'ı oluşturur. Varsayılan `:memory:`. WAL modu ve foreign key'leri etkinleştirir.
- **`schema`** — tüm SQLite tablo tanımlarını içeren namespace
- **`users`** / **`posts`** — tablo şemaları

### PostgreSQL (`@repo/db/pg`)

```ts
import { createDb, schema, users, posts } from '@repo/db/pg';
```

- **`createDb(connectionString)`** — Drizzle + node-postgres instance'ı oluşturur.
- **`schema`** — tüm PostgreSQL tablo tanımlarını içeren namespace
- **`users`** / **`posts`** — tablo şemaları

## Kullanım

```ts
// SQLite
import { createDb, users } from '@repo/db';
const db = createDb('./data/dev.db');
const allUsers = db.select().from(users).all();

// PostgreSQL
import { createDb, users } from '@repo/db/pg';
const db = createDb('postgresql://user:pass@localhost:5432/mydb');
const allUsers = await db.select().from(users);
```

## Script'ler

| Script | Açıklama |
|--------|----------|
| `pnpm build` | `tsup` ile build (multi-entry) |
| `pnpm dev` | Watch modunda build |
| `pnpm lint` | ESLint çalıştır |
| `pnpm check-types` | `tsc --noEmit` ile tip kontrolü |
| `pnpm db:generate` | SQLite migration'ları oluştur |
| `pnpm db:migrate` | SQLite migration'ları çalıştır |
| `pnpm db:studio` | Drizzle Studio aç (SQLite) |
| `pnpm db:generate:pg` | PostgreSQL migration'ları oluştur |
| `pnpm db:migrate:pg` | PostgreSQL migration'ları çalıştır |
| `pnpm db:studio:pg` | Drizzle Studio aç (PostgreSQL) |

## Notlar

- `better-sqlite3` ve `pg` tsup config'inde external olarak işaretlenmiştir — native modüller esbuild ile bundle'lanamaz.
- Varsayılan export (`@repo/db`) geriye uyumluluk için SQLite'ı re-export eder.
- Schema tanımları dialect'e özeldir (`src/sqlite/schema.ts` ve `src/pg/schema.ts`) çünkü Drizzle kolon tipleri dialect'ler arasında farklıdır.
