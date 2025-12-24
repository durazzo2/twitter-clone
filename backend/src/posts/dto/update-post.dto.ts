import { IsString, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';

export class UpdatePostDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(280)
  @IsOptional()
  content?: string;
}