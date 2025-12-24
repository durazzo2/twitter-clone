import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateRetweetDto {
  @IsInt()
  @IsNotEmpty()
  postId: number;
}
