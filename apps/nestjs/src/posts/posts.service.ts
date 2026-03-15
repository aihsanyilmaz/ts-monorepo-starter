import { Injectable, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import type { Db } from '../db/index.js';
import { posts } from '../db/index.js';
import { DB_TOKEN } from '../database/database.module.js';
import type { CreatePostDto } from './posts.dto.js';

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
    createdAt: String(row.createdAt),
  };
}

@Injectable()
export class PostsService {
  constructor(
    @Inject(DB_TOKEN) private readonly dbPromise: Promise<Db>,
  ) {}

  async findAll(): Promise<Post[]> {
    const db = await this.dbPromise;
    const rows = await db.select().from(posts);
    return rows.map(toPost);
  }

  async findOne(id: number): Promise<Post | undefined> {
    const db = await this.dbPromise;
    const rows = await db.select().from(posts).where(eq(posts.id, id));
    return rows[0] ? toPost(rows[0]) : undefined;
  }

  async create(dto: CreatePostDto): Promise<Post> {
    const db = await this.dbPromise;
    const rows = await db
      .insert(posts)
      .values({
        title: dto.title,
        content: dto.content,
        authorId: dto.authorId,
      })
      .returning();
    return toPost(rows[0]!);
  }

  async remove(id: number): Promise<Post | undefined> {
    const db = await this.dbPromise;
    const rows = await db
      .delete(posts)
      .where(eq(posts.id, id))
      .returning();
    return rows[0] ? toPost(rows[0]) : undefined;
  }
}
