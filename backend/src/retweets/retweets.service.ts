import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RetweetsService {
  constructor(private prisma: PrismaService) {}

  async retweet(userId: number, postId: number) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });

    if (!post) throw new NotFoundException('Post not found');

    const existing = await this.prisma.retweet.findUnique({
      where: {
        userId_postId: { userId, postId },
      },
    });
    if (existing) throw new ConflictException('Already retweeted this post');

    const newRetweet = await this.prisma.retweet.create({
      data: { userId, postId },
    });

    if (post.authorId !== userId) {
      await this.prisma.notification.create({
        data: {
          type: 'RETWEET',
          recipientId: post.authorId,
          issuerId: userId,
          postId: postId,
        },
      });
    }

    return newRetweet as any;
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
