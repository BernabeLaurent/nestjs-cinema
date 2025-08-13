import { getMovieProvider, MoviesProviderToken } from './movies.config';
import { TmdbProvider } from './source/providers/tmdb.provider';

interface ClassProvider {
  provide: string;
  useClass: new (...args: any[]) => any;
}

describe('Movies Config', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('getMovieProvider', () => {
    it('should return TmdbProvider by default', () => {
      delete process.env.MOVIES_SOURCE;

      const provider = getMovieProvider() as ClassProvider;

      expect(provider.provide).toBe(MoviesProviderToken);
      expect(provider.useClass).toBe(TmdbProvider);
    });

    it('should return TmdbProvider when MOVIES_SOURCE is tmdb', () => {
      process.env.MOVIES_SOURCE = 'tmdb';

      const provider = getMovieProvider() as ClassProvider;

      expect(provider.provide).toBe(MoviesProviderToken);
      expect(provider.useClass).toBe(TmdbProvider);
    });

    it('should return TmdbProvider when MOVIES_SOURCE is TMDB (uppercase)', () => {
      process.env.MOVIES_SOURCE = 'TMDB';

      const provider = getMovieProvider() as ClassProvider;

      expect(provider.provide).toBe(MoviesProviderToken);
      expect(provider.useClass).toBe(TmdbProvider);
    });

    it('should return TmdbProvider for unknown source', () => {
      process.env.MOVIES_SOURCE = 'unknown-source';

      const provider = getMovieProvider() as ClassProvider;

      expect(provider.provide).toBe(MoviesProviderToken);
      expect(provider.useClass).toBe(TmdbProvider);
    });

    it('should have correct provider token', () => {
      expect(MoviesProviderToken).toBe('MOVIES_PROVIDER');
    });
  });
});
