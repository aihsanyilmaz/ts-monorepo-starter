import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from '@repo/env';
import { eq } from 'drizzle-orm';
import type { ApiResponse, User } from '@repo/shared';
import type { Db } from '../db/index.js';
import { users } from '../db/index.js';

type Env = { Variables: { db: Db } };

const CreateUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().check(z.email()),
});

const UpdateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().check(z.email()).optional(),
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
    const response: ApiResponse<User[]> = {
      success: true,
      data: rows.map(toUser),
    };
    return c.json(response);
  })
  .get('/:id', async (c) => {
    const db = c.get('db');
    const id = Number(c.req.param('id'));
    if (Number.isNaN(id)) {
      const response: ApiResponse<never> = {
        success: false,
        error: { code: 'BAD_REQUEST', message: 'Invalid user ID' },
      };
      return c.json(response, 400);
    }
    const rows = await db.select().from(users).where(eq(users.id, id));
    const row = rows[0];
    if (!row) {
      const response: ApiResponse<never> = {
        success: false,
        error: { code: 'NOT_FOUND', message: `User ${id} not found` },
      };
      return c.json(response, 404);
    }
    const response: ApiResponse<User> = {
      success: true,
      data: toUser(row),
    };
    return c.json(response);
  })
  .post(
    '/',
    zValidator('json', CreateUserSchema, (result, c) => {
      if (!result.success) {
        const response: ApiResponse<never> = {
          success: false,
          error: { code: 'VALIDATION_ERROR', message: result.error.message },
        };
        return c.json(response, 400);
      }
    }),
    async (c) => {
      const db = c.get('db');
      const body = c.req.valid('json');
      const rows = await db.insert(users).values(body).returning();
      const response: ApiResponse<User> = {
        success: true,
        data: toUser(rows[0]!),
      };
      return c.json(response, 201);
    },
  )
  .put(
    '/:id',
    zValidator('json', UpdateUserSchema, (result, c) => {
      if (!result.success) {
        const response: ApiResponse<never> = {
          success: false,
          error: { code: 'VALIDATION_ERROR', message: result.error.message },
        };
        return c.json(response, 400);
      }
    }),
    async (c) => {
      const db = c.get('db');
      const id = Number(c.req.param('id'));
      if (Number.isNaN(id)) {
        const response: ApiResponse<never> = {
          success: false,
          error: { code: 'BAD_REQUEST', message: 'Invalid user ID' },
        };
        return c.json(response, 400);
      }
      const body = c.req.valid('json');
      const rows = await db
        .update(users)
        .set(body)
        .where(eq(users.id, id))
        .returning();
      const row = rows[0];
      if (!row) {
        const response: ApiResponse<never> = {
          success: false,
          error: { code: 'NOT_FOUND', message: `User ${id} not found` },
        };
        return c.json(response, 404);
      }
      const response: ApiResponse<User> = {
        success: true,
        data: toUser(row),
      };
      return c.json(response);
    },
  )
  .delete('/:id', async (c) => {
    const db = c.get('db');
    const id = Number(c.req.param('id'));
    if (Number.isNaN(id)) {
      const response: ApiResponse<never> = {
        success: false,
        error: { code: 'BAD_REQUEST', message: 'Invalid user ID' },
      };
      return c.json(response, 400);
    }
    const rows = await db.delete(users).where(eq(users.id, id)).returning();
    const row = rows[0];
    if (!row) {
      const response: ApiResponse<never> = {
        success: false,
        error: { code: 'NOT_FOUND', message: `User ${id} not found` },
      };
      return c.json(response, 404);
    }
    const response: ApiResponse<User> = {
      success: true,
      data: toUser(row),
    };
    return c.json(response);
  });

export default usersRoute;
