import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  Body,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RetweetsService } from './retweets.service';
import { CreateRetweetDto } from './dto/create-retweet.dto';

@Controller('retweets')
export class RetweetsController {
  constructor(private readonly retweetsService: RetweetsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createRetweetDto: CreateRetweetDto) {
    return this.retweetsService.retweet(createRetweetDto);
  }

  @Get('post/:postId')
  async getByPost(@Param('postId', ParseIntPipe) postId: number) {
    return this.retweetsService.getRetweetsByPost(postId);
  }

  @Get('user/:userId')
  async getByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.retweetsService.getRetweetsByUser(userId);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Body() createRetweetDto: CreateRetweetDto) {
    return this.retweetsService.undoRetweet(createRetweetDto);
  }
}
