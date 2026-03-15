import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { createSqliteDb } from '@repo/db/sqlite';
import { env } from '../env.js';
import * as schema from './schema.js';

export { schema };
export { users, posts } from './schema.js';

/**
 * Initialize the database: create directory, connect, run migrations.
 */
export function initDb() {
  mkdirSync(dirname(env.DATABASE_URL), { recursive: true });
  const db = createSqliteDb(env.DATABASE_URL, schema);
  migrate(db, { migrationsFolder: new URL('../../drizzle', import.meta.url).pathname });
  return db;
}

export type Db = ReturnType<typeof initDb>;
