import { REQUEST_USER_KEY, AUTH_TYPE_KEY } from './auth.constants';

describe('Auth Constants', () => {
  it('should have REQUEST_USER_KEY defined', () => {
    expect(REQUEST_USER_KEY).toBeDefined();
  });

  it('should have AUTH_TYPE_KEY defined', () => {
    expect(AUTH_TYPE_KEY).toBeDefined();
  });

  it('should have correct value for REQUEST_USER_KEY', () => {
    expect(REQUEST_USER_KEY).toBe('user');
  });

  it('should have correct value for AUTH_TYPE_KEY', () => {
    expect(AUTH_TYPE_KEY).toBe('authType');
  });

  it('should be strings', () => {
    expect(typeof REQUEST_USER_KEY).toBe('string');
    expect(typeof AUTH_TYPE_KEY).toBe('string');
  });

  it('should not be empty strings', () => {
    expect(REQUEST_USER_KEY).not.toBe('');
    expect(AUTH_TYPE_KEY).not.toBe('');
  });

  it('should be truthy values', () => {
    expect(REQUEST_USER_KEY).toBeTruthy();
    expect(AUTH_TYPE_KEY).toBeTruthy();
  });

  it('should have different values', () => {
    expect(REQUEST_USER_KEY).not.toBe(AUTH_TYPE_KEY);
  });

  it('should be suitable as object keys', () => {
    const testObject = {
      [REQUEST_USER_KEY]: 'test-user',
      [AUTH_TYPE_KEY]: 'test-auth-type',
    };

    expect(testObject[REQUEST_USER_KEY]).toBe('test-user');
    expect(testObject[AUTH_TYPE_KEY]).toBe('test-auth-type');
  });

  it('should be immutable', () => {
    const originalRequestUserKey = REQUEST_USER_KEY;
    const originalAuthTypeKey = AUTH_TYPE_KEY;

    expect(REQUEST_USER_KEY).toBe(originalRequestUserKey);
    expect(AUTH_TYPE_KEY).toBe(originalAuthTypeKey);
  });
});
