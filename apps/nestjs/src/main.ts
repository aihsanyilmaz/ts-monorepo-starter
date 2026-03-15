import 'reflect-metadata';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { sql } from 'drizzle-orm';
import { AppModule } from './app.module.js';
import { env } from './env.js';

async function bootstrap() {
  if (env.DB_DRIVER === 'sqlite') {
    // SQLite: ensure data dir + bootstrap tables
    mkdirSync(dirname(env.DATABASE_URL), { recursive: true });
    const { createDb } = await import('@repo/db/sqlite');
    const db = createDb(env.DATABASE_URL);
    db.run(sql`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL DEFAULT (current_timestamp)
    )`);
    db.run(sql`CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      author_id INTEGER NOT NULL REFERENCES users(id),
      created_at TEXT NOT NULL DEFAULT (current_timestamp)
    )`);
  } else {
    // PG: bootstrap tables with PG-compatible DDL
    const { createDb } = await import('@repo/db/pg');
    const pgDb = createDb(env.DATABASE_URL);
    await pgDb.execute(sql`CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`);
    await pgDb.execute(sql`CREATE TABLE IF NOT EXISTS posts (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      author_id INTEGER NOT NULL REFERENCES users(id),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`);
  }

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  await app.listen(env.PORT);
  console.log(`🚀 NestJS server running on http://localhost:${env.PORT}`);
}

bootstrap();
