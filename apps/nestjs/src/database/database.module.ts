import { Module, Global } from '@nestjs/common';
import { initDb } from '../db/index.js';

export const DB_TOKEN = Symbol('DB_TOKEN');

@Global()
@Module({
  providers: [
    {
      provide: DB_TOKEN,
      useFactory: () => initDb(),
    },
  ],
  exports: [DB_TOKEN],
})
export class DatabaseModule {}
