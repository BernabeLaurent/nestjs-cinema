import Joi from 'joi';

export default Joi.object({
  NODE_ENV: Joi.string()
    .valid('dev', 'production', 'test', 'staging')
    .default('dev'),
  NESTJS_PORT: Joi.number().port().default(3000),
  DATABASE_PORT: Joi.number().port().default(5432),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_HOST: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),
  DATABASE_USER: Joi.string().required(),
  API_VERSION: Joi.string().required(),
});
