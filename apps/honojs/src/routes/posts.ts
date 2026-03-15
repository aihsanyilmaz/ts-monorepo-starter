import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from '@repo/env';
import { eq } from 'drizzle-orm';
import type { ApiResponse } from '@repo/shared';
import type { Db } from '../db/index.js';
import { posts } from '../db/index.js';

type Env = { Variables: { db: Db } };

type Post = {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: string;
};

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
    const response: ApiResponse<Post[]> = {
      success: true,
      data: rows.map(toPost),
    };
    return c.json(response);
  })
  .get('/:id', async (c) => {
    const db = c.get('db');
    const id = Number(c.req.param('id'));
    if (Number.isNaN(id)) {
      const response: ApiResponse<never> = {
        success: false,
        error: { code: 'BAD_REQUEST', message: 'Invalid post ID' },
      };
      return c.json(response, 400);
    }
    const rows = await db.select().from(posts).where(eq(posts.id, id));
    const row = rows[0];
    if (!row) {
      const response: ApiResponse<never> = {
        success: false,
        error: { code: 'NOT_FOUND', message: `Post ${id} not found` },
      };
      return c.json(response, 404);
    }
    const response: ApiResponse<Post> = {
      success: true,
      data: toPost(row),
    };
    return c.json(response);
  })
  .post(
    '/',
    zValidator('json', CreatePostSchema, (result, c) => {
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
      const rows = await db
        .insert(posts)
        .values({
          title: body.title,
          content: body.content,
          authorId: body.authorId,
        })
        .returning();
      const response: ApiResponse<Post> = {
        success: true,
        data: toPost(rows[0]!),
      };
      return c.json(response, 201);
    },
  )
  .delete('/:id', async (c) => {
    const db = c.get('db');
    const id = Number(c.req.param('id'));
    if (Number.isNaN(id)) {
      const response: ApiResponse<never> = {
        success: false,
        error: { code: 'BAD_REQUEST', message: 'Invalid post ID' },
      };
      return c.json(response, 400);
    }
    const rows = await db.delete(posts).where(eq(posts.id, id)).returning();
    const row = rows[0];
    if (!row) {
      const response: ApiResponse<never> = {
        success: false,
        error: { code: 'NOT_FOUND', message: `Post ${id} not found` },
      };
      return c.json(response, 404);
    }
    const response: ApiResponse<Post> = {
      success: true,
      data: toPost(row),
    };
    return c.json(response);
  });

export default postsRoute;
