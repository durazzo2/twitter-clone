import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new post (tweet)
   * The authorId comes from the validated JWT token
   */
  async create(authorId: number, dto: CreatePostDto) {
    return (await this.prisma.post.create({
      data: {
        content: dto.content,
        authorId: authorId,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
      },
    })) as any; // Resolves ESLint: Unsafe return of a value of type any
  }

  /**
   * Fetch all posts with author info and counts
   */
  async findAll() {
    return this.prisma.post.findMany({
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
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Find a single post by ID
   */
  async findOne(id: number) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return post;
  }

  /**
   * Securely remove a post
   * Checks if the requester (userId) is the actual author
   */
  async remove(id: number, userId: number) {
    const post = await this.findOne(id);

    // SECURITY CHECK: Compare authorId in DB with userId from JWT
    if (post.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    return this.prisma.post.delete({
      where: { id },
    });
  }
}
