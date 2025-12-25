import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { FeedService } from './feed.service';
import { AuthGuard } from '@nestjs/passport';
import { FeedQueryDto } from './dto/feed-query.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get()
  async getFeed(@Request() req, @Query() query: FeedQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    return this.feedService.getPersonalizedFeed(req.user.id, page, limit);
  }
}
