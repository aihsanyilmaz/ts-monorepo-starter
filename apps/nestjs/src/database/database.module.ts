import { Module, Global } from '@nestjs/common';
import { createDb } from '@repo/db';
import { env } from '../env.js';

export const DB_TOKEN = Symbol('DB_TOKEN');

@Global()
@Module({
  providers: [
    {
      provide: DB_TOKEN,
      useFactory: () => createDb(env.DATABASE_URL),
    },
  ],
  exports: [DB_TOKEN],
})
export class DatabaseModule {}
