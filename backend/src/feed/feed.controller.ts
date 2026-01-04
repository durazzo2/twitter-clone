// NestJS: feed.controller.ts
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
import { FeedService } from './feed.service'; // 👈 Import FeedService instead

@Controller('feed')
export class FeedController {
  // 👈 Inject FeedService here
  constructor(private readonly feedService: FeedService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getFeed(
    @Req() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    // 👈 Call the method on feedService
    return this.feedService.getPersonalizedFeed(req.user.id, page, 10);
  }



  @UseGuards(AuthGuard('jwt'))
  @Get('user/:userId') // This matches the URL: http://localhost:3000/feed/user/[id]
  async getUserFeed(
    @Param('userId', ParseIntPipe) userId: number, // The profile you are viewing
    @Req() req,                                    // The logged-in user (you)
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    const currentUserId = req.user.id;
    // Calling the specific method for profile feeds
    return this.feedService.getUserProfileFeed(userId, currentUserId, page, 10);
  }

}
