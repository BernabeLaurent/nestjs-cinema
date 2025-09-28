import tmdbConfig from './tmdb.config';

describe('TMDB Config', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should be defined', () => {
    expect(tmdbConfig).toBeDefined();
  });

  it('should return TMDB configuration object with all environment values', () => {
    process.env.TMDB_API_KEY = 'test-api-key';
    process.env.TMDB_DEFAULT_LANGUAGE = 'fr-FR';
    process.env.TMDB_DEFAULT_REGION = 'FR';
    process.env.TMDB_DEFAULT_PAGE = '2';

    const config = tmdbConfig();

    expect(config).toEqual({
      baseUrl: 'https://api.themoviedb.org/3',
      imageUrl: 'https://image.tmdb.org/t/p/w500',
      apiKey: 'test-api-key',
      defaultLanguage: 'fr-FR',
      defaultCountry: 'FR',
      defaultPage: 2,
    });
  });

  it('should return default values when environment variables are not set', () => {
    delete process.env.TMDB_API_KEY;
    delete process.env.TMDB_DEFAULT_LANGUAGE;
    delete process.env.TMDB_DEFAULT_REGION;
    delete process.env.TMDB_DEFAULT_PAGE;

    const config = tmdbConfig();

    expect(config).toEqual({
      baseUrl: 'https://api.themoviedb.org/3',
      imageUrl: 'https://image.tmdb.org/t/p/w500',
      apiKey: undefined,
      defaultLanguage: 'fr-FR',
      defaultCountry: 'FR',
      defaultPage: 1,
    });
  });

  it('should parse TMDB_DEFAULT_PAGE to integer', () => {
    process.env.TMDB_DEFAULT_PAGE = '5';

    const config = tmdbConfig();

    expect(config.defaultPage).toBe(5);
    expect(typeof config.defaultPage).toBe('number');
  });

  it('should handle invalid TMDB_DEFAULT_PAGE', () => {
    process.env.TMDB_DEFAULT_PAGE = 'invalid';

    const config = tmdbConfig();

    expect(config.defaultPage).toBeNaN();
  });

  it('should have correct base URLs', () => {
    const config = tmdbConfig();

    expect(config.baseUrl).toBe('https://api.themoviedb.org/3');
    expect(config.imageUrl).toBe('https://image.tmdb.org/t/p/w500');
  });

  it('should have correct configuration key', () => {
    expect(tmdbConfig.KEY).toBe('CONFIGURATION(tmdb)');
  });
});
