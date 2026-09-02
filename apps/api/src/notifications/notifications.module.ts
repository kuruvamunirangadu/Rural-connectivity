import { Module, Global } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { NotificationTemplateService } from './notification-template.service';
import { MockSmsProvider } from './channels/sms.provider';
import { MockWhatsAppProvider } from './channels/whatsapp.provider';

@Global()
@Module({
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    NotificationTemplateService,
    MockSmsProvider,
    MockWhatsAppProvider,
  ],
  exports: [NotificationsService, NotificationTemplateService],
})
export class NotificationsModule {}
