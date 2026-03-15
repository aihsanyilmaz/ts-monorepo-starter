import type { AppType } from '@repo/honojs';
import { hc } from 'hono/client';

import { env } from '@/env';

export const apiClient = hc<AppType>(env.NEXT_PUBLIC_API_URL);
