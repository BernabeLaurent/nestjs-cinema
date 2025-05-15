import {
  forwardRef,
  Inject,
  Injectable,
  Logger,
  RequestTimeoutException,
} from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { NotificationsService } from '../notifications.service';
import { UsersService } from '../../users/users.service';

@Injectable()
export class EmailProvider {
  constructor(
    private mailerService: MailerService,
    @Inject(forwardRef(() => NotificationsService))
    private readonly notificationsService: NotificationsService,
    private readonly usersService: UsersService,
  ) {}

  private readonly logger = new Logger(EmailProvider.name, {
    timestamp: true,
  });

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

  async sendSimpleMail(
    userId: number,
    to: string,
    subject: string,
    text: string,
  ) {
    this.logger.log('sendSimpleMail');
    // On vérifie que l'utilisateur existe
    try {
      await this.usersService.findOneById(userId);
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'pb de base',
      });
    }

    try {
      await this.mailerService.sendMail({
        to,
        subject,
        template: './confirmation_inscription',
        text,
      });
      this.logger.log('email Sent to ' + to);
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: "Pb d'envoi de mail",
      });
    }
    return await this.notificationsService.addNotification(userId);
  }
}
