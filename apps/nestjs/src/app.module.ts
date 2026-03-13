import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module.js';
import { HealthModule } from './health/health.module.js';
import { UsersModule } from './users/users.module.js';
import { PostsModule } from './posts/posts.module.js';

@Module({
  imports: [DatabaseModule, HealthModule, UsersModule, PostsModule],
})
export class AppModule {}
