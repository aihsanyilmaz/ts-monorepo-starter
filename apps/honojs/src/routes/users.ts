import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import type { ApiResponse, User } from '../types.js';
import type { Db } from '../db/index.js';
import { users } from '../db/index.js';

type Env = { Variables: { db: Db } };

const CreateUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

const UpdateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
});

function toUser(row: typeof users.$inferSelect): User {
  return {
    id: String(row.id),
    name: row.name,
    email: row.email,
    createdAt: row.createdAt,
  };
}

const usersRoute = new Hono<Env>()
  .get('/', async (c) => {
    const db = c.get('db');
    const rows = await db.select().from(users);
    const response: ApiResponse<User[]> = { success: true, data: rows.map(toUser) };
    return c.json(response);
  })
  .get('/:id', async (c) => {
    const db = c.get('db');
    const id = Number(c.req.param('id'));
    if (Number.isNaN(id)) return c.json({ success: false, error: { code: 'BAD_REQUEST', message: 'Invalid user ID' } }, 400);
    const rows = await db.select().from(users).where(eq(users.id, id));
    if (!rows[0]) return c.json({ success: false, error: { code: 'NOT_FOUND', message: `User ${id} not found` } }, 404);
    return c.json({ success: true, data: toUser(rows[0]) });
  })
  .post('/', zValidator('json', CreateUserSchema, (result, c) => {
    if (!result.success) return c.json({ success: false, error: { code: 'VALIDATION_ERROR', message: result.error.message } }, 400);
  }), async (c) => {
    const db = c.get('db');
    const body = c.req.valid('json');
    const rows = await db.insert(users).values(body).returning();
    return c.json({ success: true, data: toUser(rows[0]!) }, 201);
  })
  .put('/:id', zValidator('json', UpdateUserSchema, (result, c) => {
    if (!result.success) return c.json({ success: false, error: { code: 'VALIDATION_ERROR', message: result.error.message } }, 400);
  }), async (c) => {
    const db = c.get('db');
    const id = Number(c.req.param('id'));
    if (Number.isNaN(id)) return c.json({ success: false, error: { code: 'BAD_REQUEST', message: 'Invalid user ID' } }, 400);
    const rows = await db.update(users).set(c.req.valid('json')).where(eq(users.id, id)).returning();
    if (!rows[0]) return c.json({ success: false, error: { code: 'NOT_FOUND', message: `User ${id} not found` } }, 404);
    return c.json({ success: true, data: toUser(rows[0]) });
  })
  .delete('/:id', async (c) => {
    const db = c.get('db');
    const id = Number(c.req.param('id'));
    if (Number.isNaN(id)) return c.json({ success: false, error: { code: 'BAD_REQUEST', message: 'Invalid user ID' } }, 400);
    const rows = await db.delete(users).where(eq(users.id, id)).returning();
    if (!rows[0]) return c.json({ success: false, error: { code: 'NOT_FOUND', message: `User ${id} not found` } }, 404);
    return c.json({ success: true, data: toUser(rows[0]) });
  });

export default usersRoute;
