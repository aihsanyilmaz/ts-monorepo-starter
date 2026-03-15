import { createEnv, z } from '@repo/env';

export const env = createEnv({
  server: {
    PORT: z.coerce.number().default(3002),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    DB_DRIVER: z.enum(['sqlite', 'pg']).default('sqlite'),
    DATABASE_URL: z.string().default('./data/dev.db'),
  },
  runtimeEnv: process.env,
});
