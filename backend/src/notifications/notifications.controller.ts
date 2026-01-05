import { Controller, Get, Patch, UseGuards, Request } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('notifications')
@UseGuards(AuthGuard("jwt"))
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}


  @Get()
  async getNotifications(@Request() req) {
    return this.notificationsService.getNotifications(req.user.id);
  }


  @Get('unread-count')
  async getUnreadCount(@Request() req) {
    return this.notificationsService.getUnreadCount(req.user.id);
  }

  @Patch('mark-as-read')
  async markAsRead(@Request() req) {
    return this.notificationsService.markAsRead(req.user.id);
  }
}