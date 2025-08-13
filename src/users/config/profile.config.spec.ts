import profileConfig from './profile.config';

describe('Profile Config', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should be defined', () => {
    expect(profileConfig).toBeDefined();
  });

  it('should return profile configuration object', () => {
    process.env.PROFILE_API_KEY = 'test-api-key-123';

    const config = profileConfig();

    expect(config).toEqual({
      apiKey: 'test-api-key-123',
    });
  });

  it('should return undefined for missing environment variables', () => {
    delete process.env.PROFILE_API_KEY;

    const config = profileConfig();

    expect(config).toEqual({
      apiKey: undefined,
    });
  });

  it('should have correct configuration key', () => {
    expect(profileConfig.KEY).toBe('profileConfig');
  });
});
