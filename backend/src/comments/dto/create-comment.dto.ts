import { IsString, IsNotEmpty, Length } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 500)
  content: string;
}
