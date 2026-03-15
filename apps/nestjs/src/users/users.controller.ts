import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import type { ApiResponse, User } from '@repo/shared';
import { UsersService } from './users.service.js';
import { CreateUserDto, UpdateUserDto } from './users.dto.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<ApiResponse<User[]>> {
    return { success: true, data: await this.usersService.findAll() };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiResponse<User>> {
    const numId = Number(id);
    if (Number.isNaN(numId)) {
      throw new BadRequestException('Invalid user ID');
    }
    const user = await this.usersService.findOne(numId);
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return { success: true, data: user };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateUserDto): Promise<ApiResponse<User>> {
    return { success: true, data: await this.usersService.create(dto) };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<ApiResponse<User>> {
    const numId = Number(id);
    if (Number.isNaN(numId)) {
      throw new BadRequestException('Invalid user ID');
    }
    const user = await this.usersService.update(numId, dto);
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return { success: true, data: user };
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<ApiResponse<User>> {
    const numId = Number(id);
    if (Number.isNaN(numId)) {
      throw new BadRequestException('Invalid user ID');
    }
    const user = await this.usersService.remove(numId);
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return { success: true, data: user };
  }
}
