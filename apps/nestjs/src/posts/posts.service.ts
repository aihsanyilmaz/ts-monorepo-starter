import { Injectable, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { posts } from '@repo/db';
import type { createDb } from '@repo/db';
import { DB_TOKEN } from '../database/database.module.js';
import type { CreatePostDto } from './posts.dto.js';

type DbInstance = ReturnType<typeof createDb>;

type Post = {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: string;
};

function toPost(row: typeof posts.$inferSelect): Post {
  return {
    id: String(row.id),
    title: row.title,
    content: row.content,
    authorId: String(row.authorId),
    createdAt: row.createdAt,
  };
}

@Injectable()
export class PostsService {
  constructor(@Inject(DB_TOKEN) private readonly db: DbInstance) {}

  findAll(): Post[] {
    const rows = this.db.select().from(posts).all();
    return rows.map(toPost);
  }

  findOne(id: number): Post | undefined {
    const row = this.db.select().from(posts).where(eq(posts.id, id)).get();
    return row ? toPost(row) : undefined;
  }

  create(dto: CreatePostDto): Post {
    const row = this.db
      .insert(posts)
      .values({
        title: dto.title,
        content: dto.content,
        authorId: dto.authorId,
      })
      .returning()
      .get();
    return toPost(row);
  }

  remove(id: number): Post | undefined {
    const row = this.db
      .delete(posts)
      .where(eq(posts.id, id))
      .returning()
      .get();
    return row ? toPost(row) : undefined;
  }
}
