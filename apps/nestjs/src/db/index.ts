import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { createPgDb } from '@repo/db/pg';
import { env } from '../env.js';
import * as schema from './schema.js';

export { schema };
export { users, posts } from './schema.js';

/**
 * Initialize the database: connect and run migrations.
 */
export async function initDb() {
  const db = createPgDb(env.DATABASE_URL, schema);
  await migrate(db, { migrationsFolder: new URL('../../drizzle', import.meta.url).pathname });
  return db;
}

export type Db = Awaited<ReturnType<typeof initDb>>;
