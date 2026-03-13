import { IsString, IsEmail, IsOptional, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(1)
  name!: string;

  @IsEmail()
  email!: string;
}

export class UpdateUserDto {
  @IsString()
  @MinLength(1)
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;
}
