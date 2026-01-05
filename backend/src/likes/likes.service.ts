import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LikesService {
  constructor(private prisma: PrismaService) {}

  async likePost(userId: number, postId: number) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      select: { id: true, authorId: true },
    });

    if (!post) throw new NotFoundException('Post not found');

    const existing = await this.prisma.like.findUnique({
      where: { userId_postId: { userId, postId } },
    });
    if (existing) throw new ConflictException('Post already liked');

    const newLike = await this.prisma.like.create({
      data: { userId, postId },
    });

    if (post.authorId !== userId) {
      await this.prisma.notification.create({
        data: {
          type: 'LIKE',
          recipientId: post.authorId,
          issuerId: userId,
          postId: postId,
        },
      });
    }

    return newLike;
  }

  async unlikePost(userId: number, postId: number) {
    return this.prisma.like.delete({
      where: {
        userId_postId: { userId, postId },
      },
    });
  }

  async getLikesForPost(postId: number) {
    return this.prisma.like.findMany({
      where: { postId },
      include: { user: true },
    });
  }
}
