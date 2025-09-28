import { Injectable, Logger } from '@nestjs/common';
import { EmailProvider } from '../../notifications/providers/email.provider';
import { RollbarService } from '../../common/services/rollbar.service';

@Injectable()
export class PasswordResetEmailProvider {
  private readonly logger = new Logger(PasswordResetEmailProvider.name);

  constructor(
    private readonly emailProvider: EmailProvider,
    private readonly rollbarService: RollbarService,
  ) {}

  async sendResetEmail(email: string, token: string): Promise<void> {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4200';
    const resetUrl = `${frontendUrl}/auth/reset-password?token=${token}`;

    const emailContent = {
      to: email,
      subject: 'Réinitialisation de votre mot de passe - Cinéphoria',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1976D2; margin: 0;">🎬 Cinéphoria</h1>
          </div>

          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px;">
            <h2 style="color: #1976D2; margin-top: 0;">Réinitialisation de mot de passe</h2>

            <p>Bonjour,</p>

            <p>Vous avez demandé la réinitialisation de votre mot de passe pour votre compte Cinéphoria.</p>

            <p>Cliquez sur le bouton ci-dessous pour définir un nouveau mot de passe :</p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}"
                 style="background-color: #1976D2; color: white; padding: 15px 30px;
                        text-decoration: none; border-radius: 6px; display: inline-block;
                        font-weight: bold; font-size: 16px;">
                Réinitialiser mon mot de passe
              </a>
            </div>

            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 4px; margin: 20px 0;">
              <p style="margin: 0; color: #856404;">
                <strong>⚠️ Important :</strong> Ce lien expire dans 1 heure pour votre sécurité.
              </p>
            </div>

            <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email en toute sécurité.</p>

            <p>Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :</p>
            <p style="word-break: break-all; color: #666; font-size: 12px;">${resetUrl}</p>
          </div>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">

          <div style="text-align: center;">
            <p style="color: #666; font-size: 12px; margin: 0;">
              Cet email a été envoyé automatiquement, merci de ne pas y répondre.
            </p>
            <p style="color: #666; font-size: 12px; margin: 5px 0 0 0;">
              © ${new Date().getFullYear()} Cinéphoria - Tous droits réservés
            </p>
          </div>
        </div>
      `,
    };

    try {
      await this.emailProvider.sendEmail(emailContent);
      this.logger.log(`Email de réinitialisation envoyé à ${email}`);

      // Track envoi d'email réussi
      this.rollbarService.trackEvent('password_reset_email_sent', {
        email_sent_to: email,
        frontend_url: frontendUrl,
        result: 'success'
      }, 'info');
    } catch (error) {
      this.logger.error(
        `Erreur envoi email réinitialisation à ${email}: ${error instanceof Error ? error.message : String(error)}`,
      );

      // Track erreur d'envoi d'email
      this.rollbarService.trackEvent('password_reset_email_failed', {
        email_intended_for: email,
        error_message: error instanceof Error ? error.message : String(error),
        result: 'email_send_failed'
      }, 'error');

      throw error;
    }
  }
}
