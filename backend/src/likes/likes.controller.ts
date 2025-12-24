import { Controller, Post, Delete, Get, Param, Body, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { LikesService } from './likes.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('posts/:postId/likes')
export class LikesController {
  constructor(private likesService: LikesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async likePost(
    @Req() req,
    @Param('postId', ParseIntPipe) postId: number,
  ) {
    return this.likesService.likePost(req.user.id, postId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete()
  async unlikePost(
    @Req() req,
    @Param('postId', ParseIntPipe) postId: number,
  ) {
    return this.likesService.unlikePost(req.user.id, postId);
  }

  @Get()
  async getLikes(@Param('postId', ParseIntPipe) postId: number) {
    return this.likesService.getLikesForPost(postId);
  }
}
