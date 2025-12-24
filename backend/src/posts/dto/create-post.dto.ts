import { IsNotEmpty, IsString, MaxLength, IsInt } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(280) // Twitter-like character limit
  content: string;

  @IsInt()
  @IsNotEmpty()
  authorId: number;
}