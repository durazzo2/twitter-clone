import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FeedService {
  constructor(private prisma: PrismaService) {
  }

  async getPersonalizedFeed(userId: number, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const following = await this.prisma.follow.findMany({
      where: {followerId: userId},
      select: {followingId: true},
    });

    const followingIds = following.map((f) => f.followingId).filter(Boolean);

    const authorIds = [userId, ...followingIds];

    if (authorIds.length === 0) {
      return {
        data: [],
        meta: {totalItems: 0, currentPage: page, totalPages: 0},
      };
    }

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where: {authorId: {in: authorIds}},
        orderBy: {createdAt: 'desc'},
        skip,
        take: limit,
        include: {
          author: {
            select: {
              id: true,
              username: true,
              avatarUrl: true,
              followers: {
                where: {followerId: userId},
                select: {followerId: true},
              },
            },
          },
          Comment: {
            include: {
              author: {select: {username: true, avatarUrl: true}},
            },
            orderBy: {createdAt: 'asc'},
          },
          _count: {select: {likes: true, retweets: true}},
          likes: userId ? {where: {userId}, take: 1} : false,
          retweets: userId ? {where: {userId}, take: 1} : false,
        },
      }),
      this.prisma.post.count({where: {authorId: {in: authorIds}}}),
    ]);

    const data = posts.map((post) => ({
      ...post,
      isLiked: post.likes?.length > 0,
      isFollowing: post.author.followers.length > 0,
      isRetweeted: post.retweets.length > 0,
    }));

    return {
      data,
      meta: {
        totalItems: total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
      },
    };
  }


  async getUserProfileFeed(profileUserId: number, currentUserId: number, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where: {
          OR: [
            {authorId: profileUserId},
            {retweets: {some: {userId: profileUserId}}}
          ]
        },
        orderBy: {createdAt: 'desc'},
        skip,
        take: limit,
        include: {
          author: {
            select: {
              id: true,
              username: true,
              avatarUrl: true,
              followers: currentUserId ? {
                where: {followerId: currentUserId},
                select: {followerId: true},
              } : false,
            },
          },
          Comment: {
            include: {
              author: {select: {username: true, avatarUrl: true}},
            },
            orderBy: {createdAt: 'asc'},
          },
          _count: {
            select: {likes: true, retweets: true, Comment: true}
          },
          likes: currentUserId ? {where: {userId: currentUserId}, take: 1} : false,
          retweets: {
            where: currentUserId ? {userId: currentUserId} : {userId: -1},
            take: 1
          }
        },
      }),
      this.prisma.post.count({
        where: {
          OR: [
            {authorId: profileUserId},
            {retweets: {some: {userId: profileUserId}}}
          ]
        }
      }),
    ]);

    const data = posts.map((post: any) => ({
      ...post,
      isLiked: post.likes?.length > 0,
      isFollowing: post.author?.followers?.length > 0,
      isRetweeted: post.retweets?.length > 0,
      isProfileUserRetweet: post.authorId !== profileUserId
    }));

    return {
      data,
      meta: {
        totalItems: total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}