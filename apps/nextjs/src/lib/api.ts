import { createApiClient } from '@repo/api-client';

import { env } from '@/env';

/**
 * Typed Hono RPC client instance for the API server.
 * Uses the env-validated NEXT_PUBLIC_API_URL as the base URL.
 */
export const apiClient = createApiClient(env.NEXT_PUBLIC_API_URL);
