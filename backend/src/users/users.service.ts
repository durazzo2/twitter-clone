import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { password, ...userData } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      return (await this.prisma.user.create({
        data: { ...userData, password: hashedPassword },
        select: {
          id: true,
          email: true,
          username: true,
          bio: true,
          avatarUrl: true,
          createdAt: true,
          _count: { select: { posts: true, followers: true, following: true } },
        },
      })) as any;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Email or username already exists');
      }
      throw error;
    }
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        bio: true,
        avatarUrl: true,
        _count: { select: { posts: true, followers: true, following: true } },
      },
    });
    if (!user) throw new NotFoundException(`User #${id} not found`);
    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    try {
      return await this.prisma.user.update({
        where: { id },
        data: updateUserDto,
        select: {
          id: true,
          email: true,
          username: true,
          bio: true,
          avatarUrl: true,
        },
      });
    } catch (error) {
      throw new ConflictException(
        'Update failed - possible duplicate username/email',
      );
    }
  }

  async remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }

  async followUser(followerId: number, followingId: number) {
    if (followerId === followingId) {
      throw new ConflictException('You cannot follow yourself');
    }

    const followingUser = await this.prisma.user.findUnique({
      where: { id: followingId },
    });
    if (!followingUser) {
      throw new NotFoundException(`User #${followingId} not found`);
    }

    try {
      return await this.prisma.follow.create({
        data: {
          followerId,
          followingId,
        },
        include: {
          following: {
            select: { id: true, username: true, avatarUrl: true },
          },
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('You are already following this user');
      }
      throw error;
    }
  }

  async unfollowUser(followerId: number, followingId: number) {
    try {
      return await this.prisma.follow.delete({
        where: {
          followerId_followingId: {
            followerId: followerId,
            followingId: followingId,
          },
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('You are not following this user');
      }
      throw error;
    }
  }
}
