import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FeedService {
  constructor(private prisma: PrismaService) {}

  async getPersonalizedFeed(userId: number, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const following = await this.prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    });

    const authorIds = [...following.map((f) => f.followingId), userId];

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where: { authorId: { in: authorIds } },
        orderBy: { createdAt: 'desc' },
        skip: skip,
        take: limit,
        include: {
          author: {
            select: { username: true, avatarUrl: true },
          },
          _count: {
            select: { likes: true, retweets: true },
          },
          likes: {
            where: { userId: userId },
            take: 1,
          },
        },
      }),
      this.prisma.post.count({
        where: { authorId: { in: authorIds } },
      }),
    ]);

    return {
      data: posts.map(post => ({
        ...post,
        isLiked: post.likes.length > 0,
      })),
      meta: {
        totalItems: total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
