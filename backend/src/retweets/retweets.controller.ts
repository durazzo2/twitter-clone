import { Controller, Post, Delete, Get, Param, Body, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { RetweetsService } from './retweets.service';
import { CreateRetweetDto } from './dto/create-retweet.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('retweets')
export class RetweetsController {
  constructor(private readonly retweetsService: RetweetsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Req() req, @Body() dto: CreateRetweetDto) {
    return this.retweetsService.retweet(req.user.id, dto.postId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete()
  async remove(@Req() req, @Body() dto: CreateRetweetDto) {
    return this.retweetsService.undoRetweet(req.user.id, dto.postId);
  }

  @Get('post/:postId')
  async getByPost(@Param('postId', ParseIntPipe) postId: number) {
    return this.retweetsService.getRetweetsByPost(postId);
  }
}
