// Unified async factory — use this for new code
export { createDatabase } from './client.js';
export type { Database, DatabaseConfig, DbDriver } from './client.js';

// Schema re-exports (driver-specific)
export * as sqliteSchema from './sqlite/schema.js';
export * as pgSchema from './pg/schema.js';

// Default schema export — SQLite (backward compatible)
// Apps should import from '@repo/db/sqlite' or '@repo/db/pg' for driver-specific schemas
export { users, posts } from './sqlite/schema.js';

// Legacy default export — SQLite only (backward compatible, prefer createDatabase)
export { createDb } from './sqlite/client.js';
