# @repo/db

Database package using [Drizzle ORM](https://orm.drizzle.team/) with SQLite (via `better-sqlite3`).

## Exports

```ts
import { createDb, schema, users, posts } from '@repo/db';
```

- **`createDb(url?)`** — creates a Drizzle database instance. Defaults to `:memory:` if no URL is provided. Enables WAL mode and foreign keys.
- **`schema`** — namespace containing all table definitions
- **`users`** — users table schema (id, name, email, createdAt)
- **`posts`** — posts table schema (id, title, content, authorId, createdAt)

## Usage

```ts
import { createDb, users } from '@repo/db';

const db = createDb('./data/dev.db');
const allUsers = db.select().from(users).all();
```

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm build` | Build with `tsup` |
| `pnpm dev` | Build in watch mode |
| `pnpm lint` | Run ESLint |
| `pnpm check-types` | Type-check with `tsc --noEmit` |
| `pnpm db:generate` | Generate Drizzle migrations |
| `pnpm db:migrate` | Run Drizzle migrations |
| `pnpm db:studio` | Open Drizzle Studio (database browser) |

## Notes

- `better-sqlite3` is marked as external in tsup config — native modules cannot be bundled by esbuild.
- The `pnpm.onlyBuiltDependencies` allowlist in the root `package.json` enables `better-sqlite3`'s native compilation.
