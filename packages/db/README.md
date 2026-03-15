# @repo/db

> 🇹🇷 [Türkçe](./README.tr.md)

Thin database client factory using [Drizzle ORM](https://orm.drizzle.team/). Provides **SQLite** and **PostgreSQL** client constructors via subpath exports.

**This package does not contain schemas or migrations.** Each app owns its own schema (`src/db/schema.ts`), Drizzle config, and migration files.

## Exports

### SQLite (`@repo/db/sqlite`)

```ts
import { createSqliteDb } from '@repo/db/sqlite';
import * as schema from './db/schema.js'; // your app's schema

const db = createSqliteDb('./data/dev.db', schema);
const allUsers = await db.select().from(schema.users);
```

### PostgreSQL (`@repo/db/pg`)

```ts
import { createPgDb } from '@repo/db/pg';
import * as schema from './db/schema.js'; // your app's schema

const db = createPgDb('postgresql://user:pass@localhost:5432/mydb', schema);
const allUsers = await db.select().from(schema.users);
```

### Combined (`@repo/db`)

```ts
import { createSqliteDb, createPgDb } from '@repo/db';
```

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm build` | Build with `tsup` (multi-entry) |
| `pnpm dev` | Build in watch mode |
| `pnpm lint` | Run ESLint |
| `pnpm check-types` | Type-check with `tsc --noEmit` |

## Notes

- `better-sqlite3` and `pg` are marked as external in tsup config — native modules cannot be bundled by esbuild.
- Apps should add `drizzle-kit` to their own devDependencies for schema generation and migration commands.
