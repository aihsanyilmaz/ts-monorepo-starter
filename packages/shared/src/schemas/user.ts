import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  email: z.string().check(z.email()),
  createdAt: z.string().datetime(),
});

export type User = z.infer<typeof UserSchema>;
