import {
  Controller,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Req,
  Get
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get(':postId')
  async getComments(@Param('postId', ParseIntPipe) postId: number) {
    return this.commentsService.findByPostId(postId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':postId')
  async create(
    @Param('postId', ParseIntPipe) postId: number,
    @Req() req,
    @Body() createCommentDto: CreateCommentDto, // Use the DTO
  ) {
    return this.commentsService.createComment(
      req.user.id,
      postId,
      createCommentDto.content
    );
  }
}
