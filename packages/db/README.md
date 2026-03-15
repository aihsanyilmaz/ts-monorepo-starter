# @repo/db

> 🇹🇷 [Türkçe](./README.tr.md)

Database package using [Drizzle ORM](https://orm.drizzle.team/) with **SQLite** and **PostgreSQL** support via subpath exports.

## Exports

### Default / SQLite (`@repo/db` or `@repo/db/sqlite`)

```ts
import { createDb, schema, users, posts } from '@repo/db';
// or explicitly:
import { createDb, schema, users, posts } from '@repo/db/sqlite';
```

- **`createDb(url?)`** — creates a Drizzle + better-sqlite3 instance. Defaults to `:memory:`. Enables WAL mode and foreign keys.
- **`schema`** — namespace containing all SQLite table definitions
- **`users`** / **`posts`** — table schemas

### PostgreSQL (`@repo/db/pg`)

```ts
import { createDb, schema, users, posts } from '@repo/db/pg';
```

- **`createDb(connectionString)`** — creates a Drizzle + node-postgres instance.
- **`schema`** — namespace containing all PostgreSQL table definitions
- **`users`** / **`posts`** — table schemas

## Usage

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

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm build` | Build with `tsup` (multi-entry) |
| `pnpm dev` | Build in watch mode |
| `pnpm lint` | Run ESLint |
| `pnpm check-types` | Type-check with `tsc --noEmit` |
| `pnpm db:generate` | Generate SQLite migrations |
| `pnpm db:migrate` | Run SQLite migrations |
| `pnpm db:studio` | Open Drizzle Studio (SQLite) |
| `pnpm db:generate:pg` | Generate PostgreSQL migrations |
| `pnpm db:migrate:pg` | Run PostgreSQL migrations |
| `pnpm db:studio:pg` | Open Drizzle Studio (PostgreSQL) |

## Notes

- `better-sqlite3` and `pg` are marked as external in tsup config — native modules cannot be bundled by esbuild.
- The default export (`@repo/db`) re-exports SQLite for backward compatibility.
- Schema definitions are dialect-specific (`src/sqlite/schema.ts` and `src/pg/schema.ts`) because Drizzle column types differ between dialects.
