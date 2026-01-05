import {
  Controller,
  Get,
  Query,
  Req,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe, Param,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FeedService } from './feed.service';

@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getFeed(
    @Req() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    return this.feedService.getPersonalizedFeed(req.user.id, page, 10);
  }



  @UseGuards(AuthGuard('jwt'))
  @Get('user/:userId')
  async getUserFeed(
    @Param('userId', ParseIntPipe) userId: number,
    @Req() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    const currentUserId = req.user.id;
    return this.feedService.getUserProfileFeed(userId, currentUserId, page, 10);
  }

}
