# @repo/db

> 🇬🇧 [English](./README.md)

[Drizzle ORM](https://orm.drizzle.team/) kullanan ince veritabanı client factory. Subpath export'lar ile **SQLite** ve **PostgreSQL** client constructor'ları sağlar.

**Bu paket schema veya migration içermez.** Her uygulama kendi schema'sını (`src/db/schema.ts`), Drizzle config'ini ve migration dosyalarını yönetir.

## Export'lar

### SQLite (`@repo/db/sqlite`)

```ts
import { createSqliteDb } from '@repo/db/sqlite';
import * as schema from './db/schema.js'; // uygulamanın kendi schema'sı

const db = createSqliteDb('./data/dev.db', schema);
const allUsers = await db.select().from(schema.users);
```

### PostgreSQL (`@repo/db/pg`)

```ts
import { createPgDb } from '@repo/db/pg';
import * as schema from './db/schema.js'; // uygulamanın kendi schema'sı

const db = createPgDb('postgresql://user:pass@localhost:5432/mydb', schema);
const allUsers = await db.select().from(schema.users);
```

### Birleşik (`@repo/db`)

```ts
import { createSqliteDb, createPgDb } from '@repo/db';
```

## Scriptler

| Script | Açıklama |
|--------|----------|
| `pnpm build` | `tsup` ile derle (çoklu giriş noktası) |
| `pnpm dev` | İzleme modunda derle |
| `pnpm lint` | ESLint çalıştır |
| `pnpm check-types` | `tsc --noEmit` ile tip kontrolü |

## Notlar

- `better-sqlite3` ve `pg` tsup config'de external olarak işaretlidir — native modüller esbuild ile bundle edilemez.
- Uygulamalar schema oluşturma ve migration komutları için kendi devDependencies'lerine `drizzle-kit` eklemelidir.
