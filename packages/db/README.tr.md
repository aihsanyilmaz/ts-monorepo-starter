# @repo/db

> 🇬🇧 [English](./README.md)

SQLite (`better-sqlite3` aracılığıyla) kullanan [Drizzle ORM](https://orm.drizzle.team/) tabanlı veritabanı paketi.

## Export'lar

```ts
import { createDb, schema, users, posts } from '@repo/db';
```

- **`createDb(url?)`** — bir Drizzle veritabanı örneği oluşturur. URL verilmezse varsayılan olarak `:memory:` kullanır. WAL modunu ve yabancı anahtarları etkinleştirir.
- **`schema`** — tüm tablo tanımlarını içeren ad alanı
- **`users`** — kullanıcılar tablosu şeması (id, name, email, createdAt)
- **`posts`** — gönderiler tablosu şeması (id, title, content, authorId, createdAt)

## Kullanım

```ts
import { createDb, users } from '@repo/db';

const db = createDb('./data/dev.db');
const allUsers = db.select().from(users).all();
```

## Betikler

| Betik | Açıklama |
|-------|----------|
| `pnpm build` | `tsup` ile derle |
| `pnpm dev` | İzleme modunda derle |
| `pnpm lint` | ESLint çalıştır |
| `pnpm check-types` | `tsc --noEmit` ile tip kontrolü yap |
| `pnpm db:generate` | Drizzle migration'larını oluştur |
| `pnpm db:migrate` | Drizzle migration'larını çalıştır |
| `pnpm db:studio` | Drizzle Studio'yu aç (veritabanı tarayıcısı) |

## Notlar

- `better-sqlite3`, tsup yapılandırmasında harici olarak işaretlenmiştir — yerel modüller esbuild tarafından paketlenemez.
- Kök `package.json` dosyasındaki `pnpm.onlyBuiltDependencies` izin listesi, `better-sqlite3`'ün yerel derlenmesini etkinleştirir.
