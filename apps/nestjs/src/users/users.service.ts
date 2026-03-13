import { Injectable, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { users } from '@repo/db';
import type { createDb } from '@repo/db';
import type { User } from '@repo/shared';
import { DB_TOKEN } from '../database/database.module.js';
import type { CreateUserDto, UpdateUserDto } from './users.dto.js';

type DbInstance = ReturnType<typeof createDb>;

function toUser(row: typeof users.$inferSelect): User {
  return {
    id: String(row.id),
    name: row.name,
    email: row.email,
    createdAt: row.createdAt,
  };
}

@Injectable()
export class UsersService {
  constructor(@Inject(DB_TOKEN) private readonly db: DbInstance) {}

  findAll(): User[] {
    const rows = this.db.select().from(users).all();
    return rows.map(toUser);
  }

  findOne(id: number): User | undefined {
    const row = this.db.select().from(users).where(eq(users.id, id)).get();
    return row ? toUser(row) : undefined;
  }

  create(dto: CreateUserDto): User {
    const row = this.db
      .insert(users)
      .values({ name: dto.name, email: dto.email })
      .returning()
      .get();
    return toUser(row);
  }

  update(id: number, dto: UpdateUserDto): User | undefined {
    const row = this.db
      .update(users)
      .set(dto)
      .where(eq(users.id, id))
      .returning()
      .get();
    return row ? toUser(row) : undefined;
  }

  remove(id: number): User | undefined {
    const row = this.db
      .delete(users)
      .where(eq(users.id, id))
      .returning()
      .get();
    return row ? toUser(row) : undefined;
  }
}
