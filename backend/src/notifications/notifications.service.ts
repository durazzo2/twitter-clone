import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async getNotifications(userId: number) {
    return this.prisma.notification.findMany({
      where: { recipientId: userId },
      include: {
        issuer: {
          select: {
            id: true,
            username: true,
            avatarUrl: true
          },
        },
        post: {
          select: {
            id: true,
            content: true
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getUnreadCount(userId: number) {
    const count = await this.prisma.notification.count({
      where: {
        recipientId: userId,
        read: false,
      },
    });
    return { count };
  }

  async markAsRead(userId: number) {
    return this.prisma.notification.updateMany({
      where: {
        recipientId: userId,
        read: false,
      },
      data: { read: true },
    });
  }
}