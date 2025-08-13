import emailConfig from './email.config';

describe('Email Config', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should be defined', () => {
    expect(emailConfig).toBeDefined();
  });

  it('should return email configuration object', () => {
    process.env.EMAIL_USER = 'test@example.com';
    process.env.EMAIL_PASSWORD = 'password123';
    process.env.EMAIL_FROM_NAME = 'Test App';
    process.env.EMAIL_FROM_ADDRESS = 'noreply@example.com';
    process.env.MAILGUN_API_KEY = 'key-123';
    process.env.MAILGUN_DOMAIN = 'example.com';
    process.env.MAILGUN_BASE_URL = 'https://api.mailgun.net';

    const config = emailConfig();

    expect(config).toEqual({
      user: 'test@example.com',
      password: 'password123',
      fromName: 'Test App',
      fromAddress: 'noreply@example.com',
      mailgunApiKey: 'key-123',
      mailgunDomain: 'example.com',
      mailgunBaseUrl: 'https://api.mailgun.net',
    });
  });

  it('should return undefined for missing environment variables', () => {
    const config = emailConfig();

    expect(config).toEqual({
      user: undefined,
      password: undefined,
      fromName: undefined,
      fromAddress: undefined,
      mailgunApiKey: undefined,
      mailgunDomain: undefined,
      mailgunBaseUrl: undefined,
    });
  });

  it('should have correct configuration key', () => {
    expect(emailConfig.KEY).toBe('email');
  });
});
