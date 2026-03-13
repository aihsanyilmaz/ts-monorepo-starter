import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { sql } from 'drizzle-orm';
import { env } from './env.js';
import { createDb } from '@repo/db';
import health from './routes/health.js';
import usersRoute from './routes/users.js';
import postsRoute from './routes/posts.js';

const db = createDb(env.DATABASE_URL);

// Bootstrap tables (idempotent — safe to run on every startup)
db.run(sql`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL DEFAULT (current_timestamp)
)`);
db.run(sql`CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id INTEGER NOT NULL REFERENCES users(id),
  created_at TEXT NOT NULL DEFAULT (current_timestamp)
)`);

type Env = { Variables: { db: ReturnType<typeof createDb> } };

const app = new Hono<Env>();

// Inject db into context for all routes
app.use('*', async (c, next) => {
  c.set('db', db);
  await next();
});

app.use('*', logger());
app.use('*', cors());

const routes = app
  .route('/api/health', health)
  .route('/api/users', usersRoute)
  .route('/api/posts', postsRoute);

export { routes };
export type AppType = typeof routes;

serve(
  { fetch: routes.fetch, port: env.PORT },
  (info) => {
    console.log(`🔥 Hono server running on http://localhost:${info.port}`);
  },
);
