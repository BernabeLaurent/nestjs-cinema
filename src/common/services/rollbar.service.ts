import { Injectable, Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import * as Rollbar from 'rollbar';
import rollbarConfig from '../../config/rollbar.config';
import { Level } from 'rollbar';

/**
 * Service Rollbar pour le logging et monitoring des événements
 * Permet de tracker les connexions, actions utilisateur et métriques business
 */
@Injectable()
export class RollbarService {
  private readonly rollbar?: Rollbar;

  constructor(
    @Inject(rollbarConfig.KEY)
    private readonly rollbarConfiguration: ConfigType<typeof rollbarConfig>,
  ) {
    if (this.rollbarConfiguration.enabled) {
      this.rollbar = new Rollbar({
        accessToken: this.rollbarConfiguration.accessToken,
        environment: this.rollbarConfiguration.environment,
        codeVersion: this.rollbarConfiguration.codeVersion,
        captureUncaught: this.rollbarConfiguration.captureUncaught,
        captureUnhandledRejections:
          this.rollbarConfiguration.captureUnhandledRejections,
        reportLevel: this.rollbarConfiguration.reportLevel as Level,
        ignoredMessages: this.rollbarConfiguration.ignoredMessages,
      });
    }
  }

  /**
   * Track une connexion utilisateur réussie
   * @param userId ID de l'utilisateur
   * @param email Email de l'utilisateur
   * @param role Rôle de l'utilisateur
   * @param userAgent User agent du navigateur
   * @param ipAddress Adresse IP de connexion
   */
  public trackUserLogin(
    userId: number,
    email: string,
    role: string,
    userAgent?: string,
    ipAddress?: string,
  ): void {
    if (!this.rollbar || !this.rollbarConfiguration.enabled) return;

    this.rollbar.info('User Login Success', {
      event: 'user_login',
      user: {
        id: userId.toString(),
        email,
        role,
      },
      metadata: {
        timestamp: new Date().toISOString(),
        userAgent: userAgent || 'unknown',
        ipAddress: ipAddress || 'unknown',
      },
    });
  }

  /**
   * Track une tentative de connexion échouée
   * @param email Email de la tentative
   * @param reason Raison de l'échec
   * @param userAgent User agent du navigateur
   * @param ipAddress Adresse IP de connexion
   */
  public trackFailedLogin(
    email: string,
    reason: string,
    userAgent?: string,
    ipAddress?: string,
  ): void {
    if (!this.rollbar || !this.rollbarConfiguration.enabled) return;

    this.rollbar.warning('User Login Failed', {
      event: 'user_login_failed',
      metadata: {
        email,
        reason,
        timestamp: new Date().toISOString(),
        userAgent: userAgent || 'unknown',
        ipAddress: ipAddress || 'unknown',
      },
    });
  }

  /**
   * Track un événement business personnalisé
   * @param eventName Nom de l'événement
   * @param data Données associées à l'événement
   * @param level Niveau de log (info, warning, error)
   */
  public trackEvent(
    eventName: string,
    data: Record<string, unknown>,
    level: 'info' | 'warning' | 'error' = 'info',
  ): void {
    if (!this.rollbar || !this.rollbarConfiguration.enabled) return;

    this.rollbar[level](eventName, {
      event: eventName,
      ...data,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Track une erreur avec contexte utilisateur
   * @param error Erreur à tracker
   * @param userId ID de l'utilisateur (optionnel)
   * @param additionalData Données supplémentaires
   */
  public trackError(
    error: Error,
    userId?: number,
    additionalData?: Record<string, unknown>,
  ): void {
    if (!this.rollbar || !this.rollbarConfiguration.enabled) return;

    this.rollbar.error(error, {
      user: userId ? { id: userId.toString() } : undefined,
      ...additionalData,
      timestamp: new Date().toISOString(),
    });
  }
}
