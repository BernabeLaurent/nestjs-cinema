import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
  RequestTimeoutException,
} from '@nestjs/common';
import { NotificationsService } from '../notifications.service';
import { UsersService } from '../../users/users.service';
import emailConfig from '../config/email.config';
import { ConfigType } from '@nestjs/config';
import axios from 'axios';
import qs from 'qs';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as Handlebars from 'handlebars';
import { User } from '../../users/user.entity';

@Injectable()
export class EmailProvider {
  constructor(
    @Inject(emailConfig.KEY)
    private readonly emailConfiguration: ConfigType<typeof emailConfig>, // Import de la config email
    @Inject(forwardRef(() => NotificationsService))
    private readonly notificationsService: NotificationsService,
    private readonly usersService: UsersService,
  ) {}

  private readonly logger = new Logger(EmailProvider.name, {
    timestamp: true,
  });

  // Pour récupérer là où on stocke les templates de mail
  private readonly TEMPLATE_DIR = path.join(
    __dirname,
    '..',
    'notifications',
    'templates',
  );

  async sendTemplatedEmail(
    userId: number,
    to: string,
    subject: string,
    templateName: string,
    context?: Record<string, any>,
  ) {
    this.logger.log('sendTemplatedEmail');
    // On vérifie que l'utilisateur existe
    let user: User | null;
    // ON vérifie l'utilisateur
    try {
      user = await this.usersService.findOneById(userId);
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'pb de base',
      });
    }

    if (!user) {
      throw new BadRequestException('User not found WITH THIS ID');
    }

    const html = await this.compileTemplate(templateName, context);

    const auth = {
      username: 'api',
      password: this.emailConfiguration.mailgunApiKey || '',
    };

    const data = qs.stringify({
      from: `Cinéma <mailgun@${this.emailConfiguration.mailgunDomain}>`,
      to,
      subject,
      html,
    });

    try {
      await axios.post(
        `${this.emailConfiguration.mailgunBaseUrl}${this.emailConfiguration.mailgunDomain}/messages`,
        data,
        {
          auth,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      this.logger.log(`Email HTML envoyé avec succès à ${to}`);
    } catch (error) {
      this.logger.error(`Erreur lors de l'envoi de l'email HTML à ${to}`);
      throw new RequestTimeoutException(error, {
        description: "Pb d'envoi d'email",
      });
    }

    // On enregistre la notification
    try {
      this.logger.log('Ajout de la notification...');
      const notification =
        await this.notificationsService.addNotification(userId);
      this.logger.log('Notification ajoutée avec succès');
      return notification;
    } catch (error) {
      this.logger.error(
        `Erreur lors de l'ajout de la notification pour userId: ${userId}`,
      );
      throw new RequestTimeoutException(error, {
        description: "Pb d'ajout de notification",
      });
    }
  }

  private async compileTemplate(
    templateName: string,
    context: Record<string, any> = {},
  ): Promise<string> {
    const filePath = path.join(this.TEMPLATE_DIR, `${templateName}.hbs`);
    let source: string;
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
      source = (await fs.readFile(filePath, 'utf8')) as string;
    } catch {
      throw new Error(
        `Le template "${templateName}" n'existe pas dans ${this.TEMPLATE_DIR}`,
      );
    }
    const template = Handlebars.compile(source);
    return template(context);
  }
}
