import { registerAs } from '@nestjs/config';
import * as process from 'node:process';

export default registerAs('cronFetchMoviesConfig', () => {
  return {
    enableCronFetchMovies: process.env.ENABLE_CRON_FETCH_MOVIES || false,
  };
});
