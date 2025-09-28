import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PasswordResetToken } from '../password-reset-token.entity';
import { User } from '../../users/user.entity';
import * as crypto from 'crypto';
import { HashingProvider } from './hashing.provider';
import { RollbarService } from '../../common/services/rollbar.service';

@Injectable()
export class PasswordResetProvider {
  constructor(
    @InjectRepository(PasswordResetToken)
    private readonly tokenRepository: Repository<PasswordResetToken>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingProvider: HashingProvider,
    private readonly rollbarService: RollbarService,
  ) {}

  async createResetToken(email: string): Promise<string> {
    // Vérifier si l'utilisateur existe
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      // Track tentative de reset pour email inexistant (sans révéler l'email)
      this.rollbarService.trackEvent('password_reset_request', {
        email_exists: false,
        result: 'email_not_found'
      }, 'warning');

      // Même réponse pour éviter l'énumération d'emails
      return 'success';
    }

    // Track demande de reset légitime
    this.rollbarService.trackEvent('password_reset_request', {
      user_id: user.id,
      email_exists: true,
      result: 'token_generated'
    }, 'info');

    // Invalider les anciens tokens de cet utilisateur
    await this.tokenRepository.update(
      { userId: user.id, used: false },
      { used: true },
    );

    // Générer nouveau token sécurisé
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // Expire dans 1 heure

    // Sauvegarder le token
    const resetToken = this.tokenRepository.create({
      token,
      user,
      userId: user.id,
      expiresAt,
    });

    await this.tokenRepository.save(resetToken);
    return token;
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    // Vérifier le token
    const resetToken = await this.tokenRepository.findOne({
      where: { token, used: false },
      relations: ['user'],
    });

    if (!resetToken) {
      // Track tentative d'utilisation de token invalide
      this.rollbarService.trackEvent('password_reset_attempt', {
        result: 'invalid_token',
        token_provided: !!token
      }, 'warning');

      throw new BadRequestException('Token invalide ou expiré');
    }

    // Vérifier l'expiration
    if (new Date() > resetToken.expiresAt) {
      // Track tentative d'utilisation de token expiré
      this.rollbarService.trackEvent('password_reset_attempt', {
        user_id: resetToken.userId,
        result: 'expired_token',
        token_age_hours: Math.round((new Date().getTime() - resetToken.expiresAt.getTime()) / (1000 * 60 * 60))
      }, 'warning');

      throw new BadRequestException('Token expiré');
    }

    // Hacher le nouveau mot de passe
    const hashedPassword = await this.hashingProvider.hashPassword(newPassword);

    // Mettre à jour le mot de passe
    await this.userRepository.update(resetToken.userId, {
      password: hashedPassword,
    });

    // Marquer le token comme utilisé
    await this.tokenRepository.update(resetToken.id, { used: true });

    // Track réinitialisation réussie
    this.rollbarService.trackEvent('password_reset_success', {
      user_id: resetToken.userId,
      user_email: resetToken.user.email,
      user_role: resetToken.user.roleUser
    }, 'info');
  }

  async validateResetToken(token: string): Promise<boolean> {
    const resetToken = await this.tokenRepository.findOne({
      where: { token, used: false },
    });

    return !!(resetToken && new Date() <= resetToken.expiresAt);
  }
}
