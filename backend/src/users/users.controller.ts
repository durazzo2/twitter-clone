import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  UseGuards,
  Req,
  Param,
  ParseIntPipe,
  ForbiddenException,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('suggestions')
  async getSuggestions(@Req() req) {
    const userId = req.user.id;
    return this.usersService.getDiscoveryUsers(userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('search')
  async search(@Query('query') query: string) {
    if (!query || query.length < 2) return [];
    return this.usersService.searchUsers(query);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile/:username')
  async getProfile(@Param('username') username: string) {
    return this.usersService.findByUsername(username);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads/avatars',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
  ) {
    if (file) {
      updateUserDto.avatarUrl = `/uploads/avatars/${file.filename}`;
    }
    if (req.user.id !== id) {
      throw new ForbiddenException('You can only update your own profile');
    }
    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
    if (req.user.id !== id) {
      throw new ForbiddenException('You can only delete your own account');
    }
    return this.usersService.remove(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/follow')
  async follow(@Req() req, @Param('id', ParseIntPipe) followingId: number) {
    const followerId = req.user.id;
    return this.usersService.followUser(followerId, followingId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id/follow')
  async unfollow(@Req() req, @Param('id', ParseIntPipe) followingId: number) {
    const followerId = req.user.id;
    return this.usersService.unfollowUser(followerId, followingId);
  }
}
