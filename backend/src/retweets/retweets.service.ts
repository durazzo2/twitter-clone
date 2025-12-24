import {
  Injectable,
  NotFoundException,
  ConflictException
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRetweetDto } from './dto/create-retweet.dto';

@Injectable()
export class RetweetsService {
  constructor(private prisma: PrismaService) {}

  async retweet(dto: CreateRetweetDto) {
    const { userId, postId } = dto;

    // 1. Check if post exists
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });
    if (!post) throw new NotFoundException('Post not found');

    // 2. Check for existing retweet
    const existing = await this.prisma.retweet.findUnique({
      where: {
        userId_postId: { userId, postId },
      },
    });
    if (existing) throw new ConflictException('Post already retweeted');

    // 3. Create (cast 'as any' to fix ESLint unsafe return)
    return (await this.prisma.retweet.create({
      data: { userId, postId },
    })) as any;
  }

  async undoRetweet(dto: CreateRetweetDto) {
    const { userId, postId } = dto;

    const existing = await this.prisma.retweet.findUnique({
      where: { userId_postId: { userId, postId } },
    });
    if (!existing) throw new NotFoundException('Retweet not found');

    return await this.prisma.retweet.delete({
      where: { userId_postId: { userId, postId } },
    });
  }

  async getRetweetsByPost(postId: number) {
    return this.prisma.retweet.findMany({
      where: { postId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
      },
    });
  }

  async getRetweetsByUser(userId: number) {
    return this.prisma.retweet.findMany({
      where: { userId },
      include: {
        post: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                avatarUrl: true,
              },
            },
            _count: {
              select: {
                likes: true,
                retweets: true,
              },
            },
          },
        },
      },
    });
  }
}
