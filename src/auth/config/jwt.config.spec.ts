import jwtConfig from './jwt.config';

describe('JWT Config', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should be defined', () => {
    expect(jwtConfig).toBeDefined();
  });

  it('should return configuration object with environment variables', () => {
    process.env.JWT_SECRET = 'test-secret';
    process.env.JWT_TOKEN_AUDIENCE = 'test-audience';
    process.env.JWT_TOKEN_ISSUER = 'test-issuer';
    process.env.JWT_ACCESS_TOKEN_TTL = '7200';
    process.env.JWT_REFRESH_TOKEN_TLL = '172800';
    process.env.GOOGLE_CLIENT_ID = 'test-google-client-id';
    process.env.GOOGLE_CLIENT_SECRET = 'test-google-client-secret';

    const config = jwtConfig();

    expect(config).toEqual({
      secret: 'test-secret',
      audience: 'test-audience',
      issuer: 'test-issuer',
      accessTokenTtl: 7200,
      refreshTokenTtl: 172800,
      googleClientId: 'test-google-client-id',
      googleClientSecret: 'test-google-client-secret',
    });
  });

  it('should use default values for TTL when environment variables are not set', () => {
    delete process.env.JWT_ACCESS_TOKEN_TTL;
    delete process.env.JWT_REFRESH_TOKEN_TLL;

    const config = jwtConfig();

    expect(config.accessTokenTtl).toBe(3600);
    expect(config.refreshTokenTtl).toBe(86400);
  });

  it('should handle undefined environment variables', () => {
    delete process.env.JWT_SECRET;
    delete process.env.JWT_TOKEN_AUDIENCE;
    delete process.env.JWT_TOKEN_ISSUER;
    delete process.env.GOOGLE_CLIENT_ID;
    delete process.env.GOOGLE_CLIENT_SECRET;

    const config = jwtConfig();

    expect(config.secret).toBeUndefined();
    expect(config.audience).toBeUndefined();
    expect(config.issuer).toBeUndefined();
    expect(config.googleClientId).toBeUndefined();
    expect(config.googleClientSecret).toBeUndefined();
  });

  it('should parse TTL values as integers', () => {
    process.env.JWT_ACCESS_TOKEN_TTL = '1800';
    process.env.JWT_REFRESH_TOKEN_TLL = '432000';

    const config = jwtConfig();

    expect(typeof config.accessTokenTtl).toBe('number');
    expect(typeof config.refreshTokenTtl).toBe('number');
    expect(config.accessTokenTtl).toBe(1800);
    expect(config.refreshTokenTtl).toBe(432000);
  });

  it('should handle invalid TTL values gracefully', () => {
    process.env.JWT_ACCESS_TOKEN_TTL = 'invalid';
    process.env.JWT_REFRESH_TOKEN_TLL = 'also-invalid';

    const config = jwtConfig();

    expect(config.accessTokenTtl).toBeNaN();
    expect(config.refreshTokenTtl).toBeNaN();
  });

  it('should return all required properties', () => {
    const config = jwtConfig();
    const requiredProperties = [
      'secret',
      'audience',
      'issuer',
      'accessTokenTtl',
      'refreshTokenTtl',
      'googleClientId',
      'googleClientSecret',
    ];

    requiredProperties.forEach((property) => {
      expect(config).toHaveProperty(property);
    });
  });

  it('should handle empty string TTL values', () => {
    process.env.JWT_ACCESS_TOKEN_TTL = '';
    process.env.JWT_REFRESH_TOKEN_TLL = '';

    const config = jwtConfig();

    expect(config.accessTokenTtl).toBe(3600);
    expect(config.refreshTokenTtl).toBe(86400);
  });

  it('should handle zero TTL values', () => {
    process.env.JWT_ACCESS_TOKEN_TTL = '0';
    process.env.JWT_REFRESH_TOKEN_TLL = '0';

    const config = jwtConfig();

    expect(config.accessTokenTtl).toBe(0);
    expect(config.refreshTokenTtl).toBe(0);
  });

  it('should handle negative TTL values', () => {
    process.env.JWT_ACCESS_TOKEN_TTL = '-1';
    process.env.JWT_REFRESH_TOKEN_TLL = '-100';

    const config = jwtConfig();

    expect(config.accessTokenTtl).toBe(-1);
    expect(config.refreshTokenTtl).toBe(-100);
  });
});
