import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import type { ApiResponse } from '@repo/shared';
import { PostsService } from './posts.service.js';
import { CreatePostDto } from './posts.dto.js';

type PostData = {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: string;
};

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async findAll(): Promise<ApiResponse<PostData[]>> {
    return { success: true, data: await this.postsService.findAll() };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiResponse<PostData>> {
    const numId = Number(id);
    if (Number.isNaN(numId)) {
      throw new BadRequestException('Invalid post ID');
    }
    const post = await this.postsService.findOne(numId);
    if (!post) {
      throw new NotFoundException(`Post ${id} not found`);
    }
    return { success: true, data: post };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreatePostDto): Promise<ApiResponse<PostData>> {
    return { success: true, data: await this.postsService.create(dto) };
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<ApiResponse<PostData>> {
    const numId = Number(id);
    if (Number.isNaN(numId)) {
      throw new BadRequestException('Invalid post ID');
    }
    const post = await this.postsService.remove(numId);
    if (!post) {
      throw new NotFoundException(`Post ${id} not found`);
    }
    return { success: true, data: post };
  }
}
