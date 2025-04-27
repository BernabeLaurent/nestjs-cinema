import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { EmailProvider } from './providers/email.provider';
import { NotificationsController } from './notifications.controller';

@Module({
  providers: [NotificationsService, EmailProvider],
  controllers: [NotificationsController]
})
export class NotificationsModule {}
