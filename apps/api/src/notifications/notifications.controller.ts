import { Controller, Get, Post, Patch, Param, Body, Query } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('notifications')
  async getNotifications(@Query('userId') userId?: string) {
    return this.notificationsService.getNotifications(userId);
  }

  @Get('notifications/unread-count')
  async getUnreadCount(@Query('userId') userId?: string) {
    const count = await this.notificationsService.getUnreadCount(userId);
    return { unreadCount: count };
  }

  @Patch('notifications/:id/read')
  async markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }

  @Post('notifications/read-all')
  async markAllAsRead(@Body() body: { userId?: string }) {
    return this.notificationsService.markAllAsRead(body?.userId);
  }

  @Get('notification-preferences')
  async getPreferences(@Query('userId') userId?: string) {
    return this.notificationsService.getPreferences(userId);
  }

  @Patch('notification-preferences')
  async updatePreferences(@Body() body: any) {
    const userId = body.userId || 'usr-ravi-001';
    return this.notificationsService.updatePreferences(userId, body);
  }
}
