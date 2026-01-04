import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FeedService {
  constructor(private prisma: PrismaService) {
  }

  async getPersonalizedFeed(userId: number, page: number, limit: number) {
    const skip = (page - 1) * limit;

    // Step 1: Get the IDs of users this user follows
    const following = await this.prisma.follow.findMany({
      where: {followerId: userId},
      select: {followingId: true},
    });

    const followingIds = following.map((f) => f.followingId).filter(Boolean);

    // Step 2: Include only self + followed users
    const authorIds = [userId, ...followingIds];

    // Defensive: if user follows nobody and has no posts, return empty
    if (authorIds.length === 0) {
      return {
        data: [],
        meta: {totalItems: 0, currentPage: page, totalPages: 0},
      };
    }

    // Step 3: Query posts
    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where: {authorId: {in: authorIds}},
        orderBy: {createdAt: 'desc'},
        skip,
        take: limit,
        include: {
          author: {
            select: {
              id: true, // Need ID for the follow button
              username: true,
              avatarUrl: true,
              // Check if current user is in this author's followers list
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

    // Step 4: Map flags
    const data = posts.map((post) => ({
      ...post,
      isLiked: post.likes?.length > 0,
      // If the followers array has a record, it means you follow them
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
          // We use the real relation names here
          likes: currentUserId ? {where: {userId: currentUserId}, take: 1} : false,
          retweets: { // We look at retweets to check if user has retweeted it
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

    // Use 'any' here to bypass the strict type checking on the raw Prisma result
    // while we map the custom flags Next.js needs.
    const data = posts.map((post: any) => ({
      ...post,
      isLiked: post.likes?.length > 0,
      // Followers is an array because of the include
      isFollowing: post.author?.followers?.length > 0,
      isRetweeted: post.retweets?.length > 0,
      // If the author isn't the profile user, it's a retweet in their timeline
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