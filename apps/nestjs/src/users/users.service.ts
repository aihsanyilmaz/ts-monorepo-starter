import { Injectable, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import type { User } from '@repo/shared';
import type { Db } from '../db/index.js';
import { users } from '../db/index.js';
import { DB_TOKEN } from '../database/database.module.js';
import type { CreateUserDto, UpdateUserDto } from './users.dto.js';

function toUser(row: typeof users.$inferSelect): User {
  return {
    id: String(row.id),
    name: row.name,
    email: row.email,
    createdAt: String(row.createdAt),
  };
}

@Injectable()
export class UsersService {
  constructor(
    @Inject(DB_TOKEN) private readonly dbPromise: Promise<Db>,
  ) {}

  async findAll(): Promise<User[]> {
    const db = await this.dbPromise;
    const rows = await db.select().from(users);
    return rows.map(toUser);
  }

  async findOne(id: number): Promise<User | undefined> {
    const db = await this.dbPromise;
    const rows = await db.select().from(users).where(eq(users.id, id));
    return rows[0] ? toUser(rows[0]) : undefined;
  }

  async create(dto: CreateUserDto): Promise<User> {
    const db = await this.dbPromise;
    const rows = await db
      .insert(users)
      .values({ name: dto.name, email: dto.email })
      .returning();
    return toUser(rows[0]!);
  }

  async update(id: number, dto: UpdateUserDto): Promise<User | undefined> {
    const db = await this.dbPromise;
    const rows = await db
      .update(users)
      .set(dto)
      .where(eq(users.id, id))
      .returning();
    return rows[0] ? toUser(rows[0]) : undefined;
  }

  async remove(id: number): Promise<User | undefined> {
    const db = await this.dbPromise;
    const rows = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning();
    return rows[0] ? toUser(rows[0]) : undefined;
  }
}
