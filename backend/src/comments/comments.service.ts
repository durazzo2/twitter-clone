import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async createComment(authorId: number, postId: number, content: string) {
    return this.prisma.comment.create({
      data: {
        content,
        author: { connect: { id: authorId } },
        post: { connect: { id: postId } },
      },
      include: {
        author: { select: { username: true, avatarUrl: true } }
      }
    });
  }

  async findByPostId(postId: number) {
    return this.prisma.comment.findMany({
      where: { postId },
      include: { author: { select: { username: true, avatarUrl: true } } },
      orderBy: { createdAt: 'asc' },
    });
  }
}
