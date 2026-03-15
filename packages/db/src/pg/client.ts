import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema.js';

export function createDb(connectionString: string) {
  return drizzle(connectionString, { schema });
}
