import { IsNotEmpty, IsString, MaxLength, IsInt } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(280)
  content: string;

  @IsInt()
  @IsNotEmpty()
  authorId: number;
}