import { Hono } from 'hono';
import type { ApiResponse } from '@repo/shared';

type HealthData = {
  timestamp: string;
  uptime: number;
};

const health = new Hono().get('/', (c) => {
  const response: ApiResponse<HealthData> = {
    success: true,
    data: {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
  };
  return c.json(response);
});

export default health;
