import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import type * as sqliteSchema from './sqlite/schema.js';

export type DbDriver = 'sqlite' | 'pg';

/**
 * Unified database type.
 *
 * We use the SQLite Drizzle type as the common interface because:
 * - Both SQLite and PG query builders support `await db.select().from(table)`
 * - The SQLite schema tables (users, posts) are always used as query targets
 *   (PG schema has identical structure, just different column type definitions)
 * - At runtime, PG Drizzle is compatible with SQLite schema table references
 *   for basic CRUD (select, insert, update, delete with returning)
 *
 * This avoids TypeScript union discrimination issues between SQLite and PG
 * Drizzle instances while keeping full type safety for query results.
 */
export type Database = BetterSQLite3Database<typeof sqliteSchema>;

export interface DatabaseConfig {
  driver: DbDriver;
  url: string;
}

/**
 * Create a database instance based on the driver.
 *
 * - `sqlite`: Uses better-sqlite3 (synchronous under the hood, but Drizzle query builder is thenable)
 * - `pg`: Uses node-postgres (async)
 *
 * Both return Drizzle instances where `await db.select().from(table)` works.
 *
 * @example
 * ```ts
 * const db = await createDatabase({ driver: 'sqlite', url: './data/dev.db' });
 * const users = await db.select().from(usersTable);
 * ```
 */
export async function createDatabase(config: DatabaseConfig): Promise<Database> {
  if (config.driver === 'pg') {
    const { createDb } = await import('./pg/client.js');
    return createDb(config.url) as unknown as Database;
  }

  const { createDb } = await import('./sqlite/client.js');
  return createDb(config.url) as unknown as Database;
}
