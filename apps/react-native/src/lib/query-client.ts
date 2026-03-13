import { QueryClient } from '@tanstack/react-query';

let queryClient: QueryClient | undefined;

/**
 * Module-scope singleton QueryClient for React Native.
 * No SSR concerns — always reuses the same instance.
 */
export function getQueryClient() {
  if (!queryClient) {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000,
          retry: 2,
        },
      },
    });
  }
  return queryClient;
}
