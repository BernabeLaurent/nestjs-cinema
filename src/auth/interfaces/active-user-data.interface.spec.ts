import { ActiveUserData } from './active-user-data.interface';

describe('ActiveUserData Interface', () => {
  it('should define the correct interface structure', () => {
    const mockActiveUserData: ActiveUserData = {
      sub: 1,
      email: 'test@example.com',
      bookingDetailId: 123,
    };

    expect(mockActiveUserData).toBeDefined();
    expect(mockActiveUserData.sub).toBe(1);
    expect(mockActiveUserData.email).toBe('test@example.com');
    expect(mockActiveUserData.bookingDetailId).toBe(123);
  });

  it('should allow sub as number', () => {
    const userData: ActiveUserData = {
      sub: 42,
      email: 'user@domain.com',
    };

    expect(userData.sub).toBe(42);
  });

  it('should allow email as string', () => {
    const userData: ActiveUserData = {
      sub: 1,
      email: 'test@example.org',
    };

    expect(userData.email).toBe('test@example.org');
    expect(typeof userData.email).toBe('string');
  });

  it('should make bookingDetailId optional', () => {
    const userDataWithoutBooking: ActiveUserData = {
      sub: 1,
      email: 'user@example.com',
    };

    const userDataWithBooking: ActiveUserData = {
      sub: 1,
      email: 'user@example.com',
      bookingDetailId: 456,
    };

    expect(userDataWithoutBooking.bookingDetailId).toBeUndefined();
    expect(userDataWithBooking.bookingDetailId).toBe(456);
  });

  it('should allow different email formats', () => {
    const userData: ActiveUserData = {
      sub: 1,
      email: 'user.name+tag@subdomain.example.com',
    };

    expect(userData.email).toBe('user.name+tag@subdomain.example.com');
  });

  it('should handle zero as valid sub value', () => {
    const userData: ActiveUserData = {
      sub: 0,
      email: 'zero@example.com',
    };

    expect(userData.sub).toBe(0);
  });

  it('should handle large numbers for sub', () => {
    const userData: ActiveUserData = {
      sub: 999999999,
      email: 'large@example.com',
    };

    expect(userData.sub).toBe(999999999);
  });

  it('should handle large numbers for bookingDetailId', () => {
    const userData: ActiveUserData = {
      sub: 1,
      email: 'test@example.com',
      bookingDetailId: 999999999,
    };

    expect(userData.bookingDetailId).toBe(999999999);
  });

  it('should support object destructuring', () => {
    const userData: ActiveUserData = {
      sub: 1,
      email: 'test@example.com',
      bookingDetailId: 123,
    };

    const { sub, email, bookingDetailId } = userData;

    expect(sub).toBe(1);
    expect(email).toBe('test@example.com');
    expect(bookingDetailId).toBe(123);
  });

  it('should support object spread operator', () => {
    const baseUserData: ActiveUserData = {
      sub: 1,
      email: 'test@example.com',
    };

    const extendedUserData: ActiveUserData = {
      ...baseUserData,
      bookingDetailId: 789,
    };

    expect(extendedUserData.sub).toBe(1);
    expect(extendedUserData.email).toBe('test@example.com');
    expect(extendedUserData.bookingDetailId).toBe(789);
  });

  it('should be serializable to JSON', () => {
    const userData: ActiveUserData = {
      sub: 1,
      email: 'test@example.com',
      bookingDetailId: 123,
    };

    const jsonString = JSON.stringify(userData);
    const parsedData = JSON.parse(jsonString) as ActiveUserData;

    expect(parsedData.sub).toBe(1);
    expect(parsedData.email).toBe('test@example.com');
    expect(parsedData.bookingDetailId).toBe(123);
  });

  it('should handle undefined bookingDetailId in JSON serialization', () => {
    const userData: ActiveUserData = {
      sub: 1,
      email: 'test@example.com',
    };

    const jsonString = JSON.stringify(userData);
    const parsedData = JSON.parse(jsonString) as Partial<ActiveUserData>;

    expect(parsedData.sub).toBe(1);
    expect(parsedData.email).toBe('test@example.com');
    expect(parsedData).not.toHaveProperty('bookingDetailId');
  });

  it('should support partial implementation', () => {
    const partialUserData: Partial<ActiveUserData> = {
      sub: 1,
    };

    expect(partialUserData.sub).toBe(1);
    expect(partialUserData.email).toBeUndefined();
    expect(partialUserData.bookingDetailId).toBeUndefined();
  });

  it('should support required fields check', () => {
    const hasRequiredFields = (data: unknown): data is ActiveUserData => {
      return (
        typeof data === 'object' &&
        data !== null &&
        'sub' in data &&
        'email' in data &&
        typeof (data as Record<string, unknown>).sub === 'number' &&
        typeof (data as Record<string, unknown>).email === 'string'
      );
    };

    const validData = { sub: 1, email: 'test@example.com' };
    const invalidData = { sub: 1 };

    expect(hasRequiredFields(validData)).toBe(true);
    expect(hasRequiredFields(invalidData)).toBe(false);
  });
});
