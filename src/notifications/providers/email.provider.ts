import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailProvider {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(to: string, username: string) {
    await this.mailerService.sendMail({
      to,
      subject: 'Bienvenue ! Confirme ton inscription',
      template: './confirmation', // dossier templates/confirmation.hbs
      context: {
        username,
      },
    });
  }

  async sendSimpleMail(to: string, subject: string, text: string) {
    await this.mailerService.sendMail({
      to,
      subject,
      template: './confirmation_inscription',
      text,
    });
  }
}
