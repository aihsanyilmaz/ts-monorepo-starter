import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from '@repo/env';
import { eq } from 'drizzle-orm';
import type { ApiResponse, User } from '@repo/shared';
import type { createDb } from '@repo/db';
import { users } from '@repo/db';

type Env = { Variables: { db: ReturnType<typeof createDb> } };

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
  .get('/', (c) => {
    const db = c.get('db');
    const rows = db.select().from(users).all();
    const response: ApiResponse<User[]> = {
      success: true,
      data: rows.map(toUser),
    };
    return c.json(response);
  })
  .get('/:id', (c) => {
    const db = c.get('db');
    const id = Number(c.req.param('id'));
    if (Number.isNaN(id)) {
      const response: ApiResponse<never> = {
        success: false,
        error: { code: 'BAD_REQUEST', message: 'Invalid user ID' },
      };
      return c.json(response, 400);
    }
    const row = db.select().from(users).where(eq(users.id, id)).get();
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
    (c) => {
      const db = c.get('db');
      const body = c.req.valid('json');
      const row = db.insert(users).values(body).returning().get();
      const response: ApiResponse<User> = {
        success: true,
        data: toUser(row),
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
    (c) => {
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
      const row = db
        .update(users)
        .set(body)
        .where(eq(users.id, id))
        .returning()
        .get();
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
  .delete('/:id', (c) => {
    const db = c.get('db');
    const id = Number(c.req.param('id'));
    if (Number.isNaN(id)) {
      const response: ApiResponse<never> = {
        success: false,
        error: { code: 'BAD_REQUEST', message: 'Invalid user ID' },
      };
      return c.json(response, 400);
    }
    const row = db.delete(users).where(eq(users.id, id)).returning().get();
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
