import Database from 'better-sqlite3';
import { drizzle, type BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SqliteDatabase = BetterSQLite3Database<any>;

/**
 * Create a SQLite Drizzle instance.
 *
 * @param url - Path to the SQLite database file
 * @param schema - Your app's Drizzle schema (tables, relations)
 */
export function createSqliteDb<TSchema extends Record<string, unknown>>(
  url: string,
  schema?: TSchema,
): BetterSQLite3Database<TSchema> {
  const sqlite = new Database(url);
  sqlite.pragma('journal_mode = WAL');
  sqlite.pragma('foreign_keys = ON');
  return drizzle(sqlite, { schema: schema as TSchema });
}
