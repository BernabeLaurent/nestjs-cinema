// src/movies/movies.config.ts
import { Provider } from '@nestjs/common';
import { TmdbProvider } from './source/providers/tmdb.provider';

export const MoviesProviderToken = 'MOVIES_PROVIDER';

export const getMovieProvider = (): Provider => {
  const source = process.env.MOVIES_SOURCE || 'tmdb';

  let useClass;
  switch (source.toLowerCase()) {
    // Pour le moment que tmdb
    case 'tmdb':
    default:
      useClass = TmdbProvider;
  }

  return {
    provide: MoviesProviderToken,
    useClass,
  };
};
