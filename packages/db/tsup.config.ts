import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    sqlite: 'src/sqlite/index.ts',
    pg: 'src/pg/index.ts',
  },
  format: ['esm'],
  dts: true,
  clean: true,
  outDir: 'dist',
  external: ['better-sqlite3', 'pg', 'drizzle-orm'],
});
