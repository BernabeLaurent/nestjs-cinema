import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { EmailProvider } from './providers/email.provider';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './notification.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly emailProvider: EmailProvider,
    @InjectRepository(Notification)
    private readonly notificationsRepository: Repository<Notification>,
  ) {}

  public async sendTemplatedEmail(
    userId: number,
    email: string,
    subject: string,
    templateName: string,
    context?: Record<string, any>,
  ) {
    return this.emailProvider.sendTemplatedEmail(
      userId,
      email,
      subject,
      templateName,
      context,
    );
  }

  public addNotification(userID: number) {
    try {
      const notification = this.notificationsRepository.create({
        userId: userID,
      });
      return this.notificationsRepository.save(notification);
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'pb de base',
      });
    }
  }
}
