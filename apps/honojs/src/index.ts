import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { env } from './env.js';
import { initDb, type Db } from './db/index.js';
import health from './routes/health.js';
import usersRoute from './routes/users.js';
import postsRoute from './routes/posts.js';

type Env = { Variables: { db: Db } };

const app = new Hono<Env>();

const db = initDb();

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
