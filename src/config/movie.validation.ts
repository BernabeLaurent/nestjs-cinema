import Joi from 'joi';

export default Joi.object({
  ENABLE_CRON_FETCH_MOVIES: Joi.boolean().default(false),
});
