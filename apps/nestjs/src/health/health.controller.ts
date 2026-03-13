import { Controller, Get } from '@nestjs/common';
import type { ApiResponse } from '@repo/shared';

type HealthData = {
  timestamp: string;
  uptime: number;
};

@Controller('health')
export class HealthController {
  @Get()
  getHealth(): ApiResponse<HealthData> {
    return {
      success: true,
      data: {
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      },
    };
  }
}
