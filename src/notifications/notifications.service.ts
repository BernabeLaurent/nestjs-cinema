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

  public async sendEmail(
    userId: number,
    email: string,
    subject: string,
    text: string,
  ) {
    return this.emailProvider.sendSimpleMail(userId, email, subject, text);
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
