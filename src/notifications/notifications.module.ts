import { forwardRef, Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { EmailProvider } from './providers/email.provider';
import { NotificationsController } from './notifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './notification.entity';
import { UsersModule } from '../users/users.module';
import { ConfigModule } from '@nestjs/config';
import emailConfig from './config/email.config';

@Module({
  providers: [NotificationsService, EmailProvider],
  controllers: [NotificationsController],
  exports: [NotificationsService, EmailProvider],
  imports: [
    TypeOrmModule.forFeature([Notification]),
    ConfigModule.forFeature(emailConfig),
    forwardRef(() => UsersModule),
  ],
})
export class NotificationsModule {}
