import type { AppType } from '@repo/honojs';
import { hc } from 'hono/client';

/**
 * Create a typed Hono RPC client for the API server.
 *
 * @param baseUrl - Base URL of the running Hono API server (e.g. `http://localhost:3001`)
 * @returns Typed Hono RPC client with full route inference
 */
export function createApiClient(baseUrl: string) {
  return hc<AppType>(baseUrl);
}

export type { AppType };
