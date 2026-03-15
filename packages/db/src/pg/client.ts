import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PgDatabase = NodePgDatabase<any>;

/**
 * Create a PostgreSQL Drizzle instance.
 *
 * @param connectionString - PostgreSQL connection string
 * @param schema - Your app's Drizzle schema (tables, relations)
 */
export function createPgDb<TSchema extends Record<string, unknown>>(
  connectionString: string,
  schema?: TSchema,
): NodePgDatabase<TSchema> {
  return drizzle(connectionString, { schema: schema as TSchema });
}
