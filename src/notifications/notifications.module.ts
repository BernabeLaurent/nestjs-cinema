import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { EmailProvider } from './providers/email.provider';
import { NotificationsController } from './notifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './notification.entity';
import { UsersModule } from '../users/users.module';

@Module({
  providers: [NotificationsService, EmailProvider],
  controllers: [NotificationsController],
  exports: [NotificationsModule],
  imports: [TypeOrmModule.forFeature([Notification]), UsersModule],
})
export class NotificationsModule {}
