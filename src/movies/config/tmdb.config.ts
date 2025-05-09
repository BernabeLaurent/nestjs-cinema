import { registerAs } from '@nestjs/config';
import * as process from 'node:process';

export default registerAs('tmdb', () => {
  return {
    baseUrl: 'https://api.themoviedb.org/3',
    imageUrl: 'https://image.tmdb.org/t/p/w500',
    apiKey: process.env.TMDB_API_KEY,
    defaultLanguage: process.env.TMDB_DEFAULT_LANGUAGE || 'fr-FR',
    defaultCountry: process.env.TMDB_DEFAULT_REGION || 'FR',
    defaultPage: process.env.TMDB_DEFAULT_PAGE
      ? parseInt(process.env.TMDB_DEFAULT_PAGE)
      : 1,
  };
});
