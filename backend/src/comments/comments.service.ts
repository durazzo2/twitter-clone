import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}


  async create(postId: number, userId: number, content: string) {
    const newComment = await this.prisma.comment.create({
      data: {
        content,
        postId,
        authorId: userId,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
        post: {
          select: {
            authorId: true,
          },
        },
      },
    });

    if (newComment.post.authorId !== userId) {
      await this.prisma.notification.create({
        data: {
          type: 'COMMENT',
          recipientId: newComment.post.authorId,
          issuerId: userId,
          postId: postId,
        },
      });
    }

    return newComment;
  }

  async findByPostId(postId: number) {
    return this.prisma.comment.findMany({
      where: { postId },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatarUrl: true
          }
        }
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async createComment(authorId: number, postId: number, content: string) {
    return this.create(postId, authorId, content);
  }
}