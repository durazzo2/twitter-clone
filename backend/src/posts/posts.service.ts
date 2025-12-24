import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto) {
    const post = await this.prisma.post.create({
      data: createPostDto,
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
    });
    return post;
  }

  async findAll() {
    const posts = await this.prisma.post.findMany({
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
    return posts;
  }

  async findOne(id: number) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
            bio: true,
          },
        },
        _count: {
          select: {
            likes: true,
            retweets: true,
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return post;
  }

  async findByAuthor(authorId: number) {
    const posts = await this.prisma.post.findMany({
      where: { authorId },
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
    return posts;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    await this.findOne(id);

    const post = await this.prisma.post.update({
      where: { id },
      data: updatePostDto,
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
    });
    return post;
  }

  async remove(id: number) {
    await this.findOne(id);

    const post = await this.prisma.post.delete({
      where: { id },
      select: {
        id: true,
        content: true,
        authorId: true,
      },
    });
    return post;
  }

  async getPostLikes(id: number) {
    await this.findOne(id);

    const likes = await this.prisma.like.findMany({
      where: { postId: id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return likes;
  }

  async getPostRetweets(id: number) {
    await this.findOne(id);

    const retweets = await this.prisma.retweet.findMany({
      where: { postId: id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return retweets;
  }
}