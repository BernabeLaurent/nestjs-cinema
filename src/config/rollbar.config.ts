import { registerAs } from '@nestjs/config';

/**
 * Configuration Rollbar pour le monitoring d'erreurs
 * Centralise les paramètres de configuration pour Rollbar
 */
export default registerAs('rollbar', () => ({
  accessToken: process.env.ROLLBAR_ACCESS_TOKEN,
  environment: process.env.ROLLBAR_ENVIRONMENT || process.env.NODE_ENV || 'dev',
  enabled: process.env.ROLLBAR_ENABLED === 'true',
  codeVersion: process.env.ROLLBAR_CODE_VERSION || 'unknown',
  captureUncaught: true,
  captureUnhandledRejections: true,
  reportLevel: process.env.NODE_ENV === 'production' ? 'warning' : 'debug',
  ignoredMessages: ['Non-Error exception captured', 'Script error'],
}));
