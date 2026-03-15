import { serve } from '@hono/node-server';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { sql } from 'drizzle-orm';
import { env } from './env.js';
import { createDatabase, type Database } from '@repo/db';
import health from './routes/health.js';
import usersRoute from './routes/users.js';
import postsRoute from './routes/posts.js';

type Env = { Variables: { db: Database } };

const app = new Hono<Env>();

async function bootstrap() {
  // SQLite: ensure data dir exists before opening DB
  if (env.DB_DRIVER === 'sqlite') {
    mkdirSync(dirname(env.DATABASE_URL), { recursive: true });
  }

  const db = await createDatabase({
    driver: env.DB_DRIVER,
    url: env.DATABASE_URL,
  });

  // Bootstrap tables (idempotent)
  if (env.DB_DRIVER === 'sqlite') {
    const { createDb } = await import('@repo/db/sqlite');
    const sqliteDb = createDb(env.DATABASE_URL);
    sqliteDb.run(sql`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL DEFAULT (current_timestamp)
    )`);
    sqliteDb.run(sql`CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      author_id INTEGER NOT NULL REFERENCES users(id),
      created_at TEXT NOT NULL DEFAULT (current_timestamp)
    )`);
  } else {
    const { createDb } = await import('@repo/db/pg');
    const pgDb = createDb(env.DATABASE_URL);
    await pgDb.execute(sql`CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`);
    await pgDb.execute(sql`CREATE TABLE IF NOT EXISTS posts (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      author_id INTEGER NOT NULL REFERENCES users(id),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`);
  }

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

  serve(
    { fetch: routes.fetch, port: env.PORT },
    (info) => {
      console.log(`🔥 Hono server running on http://localhost:${info.port}`);
    },
  );

  return routes;
}

const routesPromise = bootstrap();

export { routesPromise };
export type AppType = Awaited<ReturnType<typeof bootstrap>>;
