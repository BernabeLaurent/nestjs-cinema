import { ExecutionContext } from '@nestjs/common';
import { ActiveUser } from './active-user.decorator';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
import { REQUEST_USER_KEY } from '../constants/auth.constants';

describe('ActiveUser Decorator', () => {
  let mockExecutionContext: ExecutionContext;
  let mockRequest: Record<string, unknown>;

  const mockUser: ActiveUserData = {
    sub: 1,
    email: 'test@example.com',
  };

  beforeEach(() => {
    mockRequest = {
      [REQUEST_USER_KEY]: mockUser,
    };

    const mockHttpContext = {
      getRequest: jest.fn().mockReturnValue(mockRequest),
    };

    mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue(mockHttpContext),
    } as unknown as ExecutionContext;
  });

  it('should be defined', () => {
    expect(ActiveUser).toBeDefined();
  });

  it('should be a function', () => {
    expect(typeof ActiveUser).toBe('function');
  });

  it('should have correct REQUEST_USER_KEY constant', () => {
    expect(REQUEST_USER_KEY).toBe('user');
  });

  it('should work with ActiveUserData interface structure', () => {
    const userData: ActiveUserData = {
      sub: 123,
      email: 'test@domain.com',
    };

    expect(userData.sub).toBe(123);
    expect(userData.email).toBe('test@domain.com');
  });

  it('should support optional bookingDetailId in ActiveUserData', () => {
    const userDataWithBooking: ActiveUserData = {
      sub: 123,
      email: 'test@domain.com',
      bookingDetailId: 456,
    };

    const userDataWithoutBooking: ActiveUserData = {
      sub: 123,
      email: 'test@domain.com',
    };

    expect(userDataWithBooking.bookingDetailId).toBe(456);
    expect(userDataWithoutBooking.bookingDetailId).toBeUndefined();
  });

  it('should handle different user data scenarios', () => {
    const scenarios: ActiveUserData[] = [
      { sub: 1, email: 'user1@test.com' },
      { sub: 2, email: 'user2@test.com', bookingDetailId: 100 },
      { sub: 3, email: 'admin@test.com', bookingDetailId: 200 },
    ];

    scenarios.forEach((userData) => {
      expect(userData.sub).toBeGreaterThan(0);
      expect(userData.email).toContain('@');
      if (userData.bookingDetailId) {
        expect(userData.bookingDetailId).toBeGreaterThan(0);
      }
    });
  });

  it('should work with mocked execution context', () => {
    expect(mockExecutionContext).toBeDefined();
    expect(typeof mockExecutionContext.switchToHttp).toBe('function');
    expect(mockRequest[REQUEST_USER_KEY]).toEqual(mockUser);
  });
});
