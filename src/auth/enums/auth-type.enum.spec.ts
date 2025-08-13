import { AuthType } from './auth-type.enum';

describe('AuthType Enum', () => {
  it('should be defined', () => {
    expect(AuthType).toBeDefined();
  });

  it('should have Bearer value', () => {
    expect(AuthType.Bearer).toBeDefined();
    expect(AuthType.Bearer).toBe(0);
  });

  it('should have None value', () => {
    expect(AuthType.None).toBeDefined();
    expect(AuthType.None).toBe(1);
  });

  it('should contain all expected auth types', () => {
    const expectedTypes = [0, 1];
    const enumValues = Object.values(AuthType).filter(
      (value) => typeof value === 'number',
    );

    expect(enumValues).toEqual(expectedTypes);
    expect(enumValues).toHaveLength(2);
  });

  it('should have correct keys', () => {
    const expectedKeys = ['Bearer', 'None'];
    const enumKeys = Object.keys(AuthType).filter((key) => isNaN(Number(key)));

    expect(enumKeys).toEqual(expectedKeys);
    expect(enumKeys).toHaveLength(2);
  });

  it('should be able to iterate over enum values', () => {
    const numericValues = Object.values(AuthType).filter(
      (value) => typeof value === 'number',
    );

    numericValues.forEach((value) => {
      expect(typeof value).toBe('number');
      expect(value).toBeGreaterThanOrEqual(0);
    });
  });

  it('should support authentication workflow states', () => {
    expect(AuthType.Bearer).toBeDefined();
    expect(AuthType.None).toBeDefined();
  });

  it('should be usable in switch statements', () => {
    const testAuthType = (authType: AuthType) => {
      switch (authType) {
        case AuthType.Bearer:
          return 'bearer-auth';
        case AuthType.None:
          return 'no-auth';
        default:
          return 'unknown';
      }
    };

    expect(testAuthType(AuthType.Bearer)).toBe('bearer-auth');
    expect(testAuthType(AuthType.None)).toBe('no-auth');
  });

  it('should maintain numeric values for comparison', () => {
    expect(AuthType.Bearer).toBe(0);
    expect(AuthType.None).toBe(1);
  });

  it('should support enum value comparison', () => {
    expect(Number(AuthType.Bearer)).toBe(0);
    expect(Number(AuthType.None)).toBe(1);

    const bearer = AuthType.Bearer;
    const none = AuthType.None;
    expect(bearer).not.toBe(none);
  });

  it('should be serializable to JSON', () => {
    expect(JSON.stringify(AuthType.Bearer)).toBe('0');
    expect(JSON.stringify(AuthType.None)).toBe('1');
  });

  it('should have string keys accessible', () => {
    const enumAsRecord = AuthType as Record<number, string>;
    expect(enumAsRecord[0]).toBe('Bearer');
    expect(enumAsRecord[1]).toBe('None');
  });

  it('should support reverse mapping', () => {
    const enumAsRecord = AuthType as Record<number, string>;
    expect(enumAsRecord[AuthType.Bearer]).toBe('Bearer');
    expect(enumAsRecord[AuthType.None]).toBe('None');
  });

  it('should handle authentication type checks', () => {
    const isBearer = (authType: AuthType) => authType === AuthType.Bearer;
    const isNone = (authType: AuthType) => authType === AuthType.None;

    expect(isBearer(AuthType.Bearer)).toBe(true);
    expect(isBearer(AuthType.None)).toBe(false);
    expect(isNone(AuthType.None)).toBe(true);
    expect(isNone(AuthType.Bearer)).toBe(false);
  });

  it('should have consistent enum structure', () => {
    const keys = Object.keys(AuthType);
    const values = Object.values(AuthType);

    expect(keys).toContain('Bearer');
    expect(keys).toContain('None');
    expect(keys).toContain('0');
    expect(keys).toContain('1');

    expect(values).toContain('Bearer');
    expect(values).toContain('None');
    expect(values).toContain(0);
    expect(values).toContain(1);
  });
});
