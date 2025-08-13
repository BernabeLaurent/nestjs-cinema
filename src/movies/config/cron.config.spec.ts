import cronConfig from './cron.config';

describe('Cron Config', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should be defined', () => {
    expect(cronConfig).toBeDefined();
  });

  it('should return cron configuration object with environment value', () => {
    process.env.ENABLE_CRON_FETCH_MOVIES = 'true';

    const config = cronConfig();

    expect(config).toEqual({
      enableCronFetchMovies: 'true',
    });
  });

  it('should return false by default when environment variable is not set', () => {
    delete process.env.ENABLE_CRON_FETCH_MOVIES;

    const config = cronConfig();

    expect(config).toEqual({
      enableCronFetchMovies: false,
    });
  });

  it('should return environment value when set to false', () => {
    process.env.ENABLE_CRON_FETCH_MOVIES = 'false';

    const config = cronConfig();

    expect(config).toEqual({
      enableCronFetchMovies: 'false',
    });
  });

  it('should return custom value when environment variable is set', () => {
    process.env.ENABLE_CRON_FETCH_MOVIES = 'custom-value';

    const config = cronConfig();

    expect(config).toEqual({
      enableCronFetchMovies: 'custom-value',
    });
  });

  it('should have correct configuration key', () => {
    expect(cronConfig.KEY).toBe('cronFetchMoviesConfig');
  });
});
