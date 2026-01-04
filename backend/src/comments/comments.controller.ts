import {
  Controller,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Req,
  Get,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateCommentDto } from './dto/create-comment.dto';


@Controller('posts/:postId/comments') // :postId is defined here once
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get() // Remove ':postId' from here
  async getComments(@Param('postId', ParseIntPipe) postId: number) {
    return this.commentsService.findByPostId(postId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post() // Remove ':postId' from here
  async create(
    @Param('postId', ParseIntPipe) postId: number, // NestJS still gets it from the Controller path
    @Req() req,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentsService.createComment(
      req.user.id,
      postId,
      createCommentDto.content,
    );
  }
}
