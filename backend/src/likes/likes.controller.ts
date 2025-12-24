import { Controller, Post, Delete, Get, Param, Body, ParseIntPipe } from '@nestjs/common';
import { LikesService } from './likes.service';

@Controller('posts/:postId/likes')
export class LikesController {
  constructor(private likesService: LikesService) {}

  @Post()
  async likePost(
    @Body('userId', ParseIntPipe) userId: number,
    @Param('postId', ParseIntPipe) postId: number,
  ) {
    return this.likesService.likePost(userId, postId);
  }

  @Delete()
  async unlikePost(
    @Body('userId', ParseIntPipe) userId: number,
    @Param('postId', ParseIntPipe) postId: number,
  ) {
    return this.likesService.unlikePost(userId, postId);
  }

  @Get()
  async getLikes(@Param('postId', ParseIntPipe) postId: number) {
    return this.likesService.getLikesForPost(postId);
  }
}
