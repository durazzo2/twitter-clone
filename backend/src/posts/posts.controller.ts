import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  /**
   * Create a new Tweet
   * Protected: Requires valid JWT in Authorization header
   */
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Req() req, @Body() createPostDto: CreatePostDto) {
    // req.user.id is populated by your JwtStrategy validate() method
    return this.postsService.create(req.user.id, createPostDto);
  }

  /**
   * Fetch all Tweets for the global feed
   * Public: Anyone can view tweets
   */
  @Get()
  async findAll() {
    return this.postsService.findAll();
  }

  /**
   * Fetch a specific Tweet by ID
   * Public
   */
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.findOne(id);
  }

  /**
   * Delete a Tweet
   * Protected: Only the author of the tweet can delete it
   */
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
  ) {
    // We pass both IDs to the service to verify ownership
    return this.postsService.remove(id, req.user.id);
  }
}
