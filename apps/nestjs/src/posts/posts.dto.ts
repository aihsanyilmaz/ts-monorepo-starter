import { IsString, IsNumber, IsInt, IsPositive, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePostDto {
  @IsString()
  @MinLength(1)
  title!: string;

  @IsString()
  @MinLength(1)
  content!: string;

  @Type(() => Number)
  @IsNumber()
  @IsInt()
  @IsPositive()
  authorId!: number;
}
