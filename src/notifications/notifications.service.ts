import { Injectable } from '@nestjs/common';
import { EmailProvider } from './providers/email.provider';

@Injectable()
export class NotificationsService {
  constructor(private readonly emailProvider: EmailProvider) {}

  public async sendEmail(email: string, subject: string, text: string) {
    return this.emailProvider.sendSimpleMail(email, subject, text);
  }
}
