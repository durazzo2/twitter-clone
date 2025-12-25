import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(authorId: number, dto: CreatePostDto, imageUrl?: string) {
    return await this.prisma.post.create({
      data: {
        content: dto.content,
        imageUrl: imageUrl,
        authorId: authorId,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
      },
    });
  }

  async findAll(currentUserId?: number) {
    const posts = await this.prisma.post.findMany({
      include: {
        author: {
          select: { id: true, username: true, avatarUrl: true }
        },
        // 1. Get the total number of likes
        _count: {
          select: {
            likes: true,
            Comment: true,
            retweets: true
          },
        },
        // 2. Check if the CURRENT user has a record in the Like table
        likes: currentUserId ? {
          where: { userId: currentUserId },
          select: { userId: true },
        } : false,
      },
      orderBy: { createdAt: 'desc' },
    });

    // 3. Transform the Prisma output into the format your Next.js expects
    return posts.map((post) => ({
      ...post,
      likesCount: post._count.likes,
      commentsCount: post._count.Comment,
      retweetsCount: post._count.retweets,
      // If the likes array has any items, it means the current user liked it
      isLiked: post.likes && post.likes.length > 0,
    }));
  }



  async findOne(id: number) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return post;
  }

  async remove(id: number, userId: number) {
    const post = await this.findOne(id);

    if (post.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    return this.prisma.post.delete({
      where: { id },
    });
  }
}
