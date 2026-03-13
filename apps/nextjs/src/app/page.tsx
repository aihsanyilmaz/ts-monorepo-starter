'use client';

import { useQuery } from '@tanstack/react-query';
import type { User } from '@repo/shared';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { apiClient } from '@/lib/api';

type UsersResponse = {
  success: boolean;
  data?: User[];
  error?: { code: string; message: string };
};

async function fetchUsers(): Promise<User[]> {
  const res = await apiClient.api.users.$get();

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  const json: UsersResponse = await res.json();

  if (!json.success || !json.data) {
    throw new Error(json.error?.message ?? 'Failed to fetch users');
  }

  return json.data;
}

export default function HomePage() {
  const {
    data: users,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">Users</h1>
      <p className="text-muted-foreground mb-8">
        Fetched from the Hono API via TanStack Query and @repo/api-client.
      </p>

      {isLoading && (
        <div className="py-12 text-center" role="status">
          <div className="border-primary mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
          <p className="text-muted-foreground text-sm">Loading users…</p>
        </div>
      )}

      {error && (
        <div
          className="bg-destructive/10 text-destructive rounded-lg border border-red-200 p-4"
          role="alert"
        >
          <p className="font-medium">Error loading users</p>
          <p className="text-sm">{error.message}</p>
        </div>
      )}

      {users && users.length === 0 && (
        <div className="text-muted-foreground py-12 text-center">
          <p className="text-lg font-medium">No users yet</p>
          <p className="text-sm">
            Create users via the Hono API at{' '}
            <code className="bg-muted rounded px-1.5 py-0.5 text-xs">
              POST /api/users
            </code>
          </p>
        </div>
      )}

      {users && users.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => (
            <Card key={user.id}>
              <CardHeader>
                <CardTitle className="text-lg">{user.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">{user.email}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
