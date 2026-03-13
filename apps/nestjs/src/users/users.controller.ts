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
  findAll(): ApiResponse<User[]> {
    return { success: true, data: this.usersService.findAll() };
  }

  @Get(':id')
  findOne(@Param('id') id: string): ApiResponse<User> {
    const numId = Number(id);
    if (Number.isNaN(numId)) {
      throw new BadRequestException('Invalid user ID');
    }
    const user = this.usersService.findOne(numId);
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return { success: true, data: user };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateUserDto): ApiResponse<User> {
    return { success: true, data: this.usersService.create(dto) };
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ): ApiResponse<User> {
    const numId = Number(id);
    if (Number.isNaN(numId)) {
      throw new BadRequestException('Invalid user ID');
    }
    const user = this.usersService.update(numId, dto);
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return { success: true, data: user };
  }

  @Delete(':id')
  remove(@Param('id') id: string): ApiResponse<User> {
    const numId = Number(id);
    if (Number.isNaN(numId)) {
      throw new BadRequestException('Invalid user ID');
    }
    const user = this.usersService.remove(numId);
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return { success: true, data: user };
  }
}
