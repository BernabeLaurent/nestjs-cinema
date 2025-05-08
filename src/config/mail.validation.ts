import Joi from 'joi';

export default Joi.object({
  EMAIL_USER: Joi.string().required(),
  EMAIL_PASSWORD: Joi.string().required(),
  EMAIL_FROM_NAME: Joi.string().required(),
  EMAIL_FROM_ADDRESS: Joi.string().required(),
});
