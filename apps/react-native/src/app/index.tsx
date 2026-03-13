import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import type { User } from '@repo/shared';

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

export default function HomeScreen() {
  const {
    data: users,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Users</Text>
      <Text style={styles.subtitle}>
        Fetched from the Hono API via TanStack Query and @repo/api-client.
      </Text>

      {isLoading && (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>Loading users…</Text>
        </View>
      )}

      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorTitle}>Error loading users</Text>
          <Text style={styles.errorMessage}>{error.message}</Text>
        </View>
      )}

      {users && users.length === 0 && (
        <View style={styles.centered}>
          <Text style={styles.emptyTitle}>No users yet</Text>
          <Text style={styles.emptyHint}>
            Create users via the Hono API at POST /api/users
          </Text>
        </View>
      )}

      {users && users.length > 0 && (
        <FlatList
          data={users}
          keyExtractor={(user) => user.id}
          contentContainerStyle={styles.list}
          renderItem={({ item: user }) => (
            <View style={styles.card}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 24,
  },
  centered: {
    alignItems: 'center',
    paddingTop: 48,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6b7280',
  },
  errorBox: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#dc2626',
    marginBottom: 4,
  },
  errorMessage: {
    fontSize: 14,
    color: '#dc2626',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 4,
  },
  emptyHint: {
    fontSize: 14,
    color: '#9ca3af',
  },
  list: {
    gap: 12,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#f9fafb',
    borderColor: '#e5e7eb',
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: '#6b7280',
  },
});
