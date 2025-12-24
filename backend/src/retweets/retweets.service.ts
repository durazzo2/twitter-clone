import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RetweetsService {
  constructor(private prisma: PrismaService) {}

  async retweet(userId: number, postId: number) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');

    const existing = await this.prisma.retweet.findUnique({
      where: {
        userId_postId: { userId, postId },
      },
    });
    if (existing) throw new ConflictException('Already retweeted this post');

    return (await this.prisma.retweet.create({
      data: { userId, postId },
    })) as any;
  }

  async undoRetweet(userId: number, postId: number) {
    const existing = await this.prisma.retweet.findUnique({
      where: {
        userId_postId: { userId, postId },
      },
    });

    if (!existing) throw new NotFoundException('Retweet not found');

    return await this.prisma.retweet.delete({
      where: {
        userId_postId: { userId, postId },
      },
    });
  }

  async getRetweetsByPost(postId: number) {
    return this.prisma.retweet.findMany({
      where: { postId },
      include: {
        user: {
          select: { id: true, username: true, avatarUrl: true },
        },
      },
    });
  }
}
