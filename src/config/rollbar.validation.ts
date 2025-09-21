import Joi from 'joi';

/**
 * Schéma de validation Joi pour la configuration Rollbar
 * Valide les variables d'environnement liées au monitoring d'erreurs
 */
export default Joi.object({
  ROLLBAR_ACCESS_TOKEN: Joi.string().required(),
  ROLLBAR_ENVIRONMENT: Joi.string()
    .valid('dev', 'production', 'test', 'staging')
    .default('dev'),
  ROLLBAR_ENABLED: Joi.boolean().default(true),
  ROLLBAR_CODE_VERSION: Joi.string().optional(),
});
