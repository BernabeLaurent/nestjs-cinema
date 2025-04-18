import { registerAs } from '@nestjs/config';

export default registerAs('tmdb', () => {
  return {
    baseUrl: 'https://api.themoviedb.org/3',
    apiKey: process.env.TMDB_API_KEY,
  };
});