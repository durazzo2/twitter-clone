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
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');

    const existing = await this.prisma.like.findUnique({
      where: { userId_postId: { userId, postId } },
    });
    if (existing) throw new ConflictException('Post already liked');

    return (await this.prisma.like.create({
      data: { userId, postId },
    })) as any;
  }

  // async unlikePost(userId: number, postId: number) {
  //   const existing = await this.prisma.like.findUnique({
  //     where: { userId_postId: { userId, postId } },
  //   });
  //   if (!existing) throw new NotFoundException('Like not found');
  //
  //   return await this.prisma.like.delete({
  //     where: { userId_postId: { userId, postId } },
  //   });
  // }
  async unlikePost(userId: number, postId: number) {
    return this.prisma.like.delete({
      where: {
        // Prisma uses this combined name for your composite @id
        userId_postId: {
          userId: userId,
          postId: postId,
        },
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
