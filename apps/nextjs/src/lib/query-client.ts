import { QueryClient, isServer } from '@tanstack/react-query';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // SSR: don't refetch immediately on the client when data was prefetched on server
        staleTime: 60 * 1000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

/**
 * Module-scope singleton pattern for TanStack Query with SSR.
 *
 * - Server: always creates a new QueryClient per request (no leaking between requests)
 * - Browser: reuses a single instance across the app lifetime
 */
export function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  }

  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}
