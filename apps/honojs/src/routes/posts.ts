import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import type { ApiResponse, Post } from '../types.js';
import type { Db } from '../db/index.js';
import { posts } from '../db/index.js';

type Env = { Variables: { db: Db } };

const CreatePostSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  authorId: z.coerce.number().int().positive(),
});

function toPost(row: typeof posts.$inferSelect): Post {
  return {
    id: String(row.id),
    title: row.title,
    content: row.content,
    authorId: String(row.authorId),
    createdAt: row.createdAt,
  };
}

const postsRoute = new Hono<Env>()
  .get('/', async (c) => {
    const db = c.get('db');
    const rows = await db.select().from(posts);
    return c.json({ success: true, data: rows.map(toPost) });
  })
  .get('/:id', async (c) => {
    const db = c.get('db');
    const id = Number(c.req.param('id'));
    if (Number.isNaN(id)) return c.json({ success: false, error: { code: 'BAD_REQUEST', message: 'Invalid post ID' } }, 400);
    const rows = await db.select().from(posts).where(eq(posts.id, id));
    if (!rows[0]) return c.json({ success: false, error: { code: 'NOT_FOUND', message: `Post ${id} not found` } }, 404);
    return c.json({ success: true, data: toPost(rows[0]) });
  })
  .post('/', zValidator('json', CreatePostSchema, (result, c) => {
    if (!result.success) return c.json({ success: false, error: { code: 'VALIDATION_ERROR', message: result.error.message } }, 400);
  }), async (c) => {
    const db = c.get('db');
    const { title, content, authorId } = c.req.valid('json');
    const rows = await db.insert(posts).values({ title, content, authorId }).returning();
    return c.json({ success: true, data: toPost(rows[0]!) }, 201);
  })
  .delete('/:id', async (c) => {
    const db = c.get('db');
    const id = Number(c.req.param('id'));
    if (Number.isNaN(id)) return c.json({ success: false, error: { code: 'BAD_REQUEST', message: 'Invalid post ID' } }, 400);
    const rows = await db.delete(posts).where(eq(posts.id, id)).returning();
    if (!rows[0]) return c.json({ success: false, error: { code: 'NOT_FOUND', message: `Post ${id} not found` } }, 404);
    return c.json({ success: true, data: toPost(rows[0]) });
  });

export default postsRoute;
