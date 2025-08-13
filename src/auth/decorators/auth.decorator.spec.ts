import { SetMetadata } from '@nestjs/common';
import { Auth } from './auth.decorator';
import { AuthType } from '../enums/auth-type.enum';
import { AUTH_TYPE_KEY } from '../constants/auth.constants';

jest.mock('@nestjs/common', () => ({
  SetMetadata: jest.fn(),
}));

describe('Auth Decorator', () => {
  const mockSetMetadata = SetMetadata as jest.MockedFunction<
    typeof SetMetadata
  >;

  beforeEach(() => {
    mockSetMetadata.mockClear();
  });

  it('should be defined', () => {
    expect(Auth).toBeDefined();
  });

  it('should call SetMetadata with correct parameters for single AuthType', () => {
    Auth(AuthType.Bearer);

    expect(mockSetMetadata).toHaveBeenCalledWith(AUTH_TYPE_KEY, [
      AuthType.Bearer,
    ]);
    expect(mockSetMetadata).toHaveBeenCalledTimes(1);
  });

  it('should call SetMetadata with multiple AuthTypes', () => {
    Auth(AuthType.Bearer, AuthType.None);

    expect(mockSetMetadata).toHaveBeenCalledWith(AUTH_TYPE_KEY, [
      AuthType.Bearer,
      AuthType.None,
    ]);
    expect(mockSetMetadata).toHaveBeenCalledTimes(1);
  });

  it('should handle None AuthType', () => {
    Auth(AuthType.None);

    expect(mockSetMetadata).toHaveBeenCalledWith(AUTH_TYPE_KEY, [
      AuthType.None,
    ]);
  });

  it('should handle empty arguments', () => {
    Auth();

    expect(mockSetMetadata).toHaveBeenCalledWith(AUTH_TYPE_KEY, []);
  });

  it('should handle all AuthType values', () => {
    const allAuthTypes = Object.values(AuthType).filter(
      (value) => typeof value === 'number',
    ) as AuthType[];
    Auth(...allAuthTypes);

    expect(mockSetMetadata).toHaveBeenCalledWith(AUTH_TYPE_KEY, allAuthTypes);
  });

  it('should preserve order of AuthTypes', () => {
    const orderedTypes = [AuthType.None, AuthType.Bearer];
    Auth(...orderedTypes);

    expect(mockSetMetadata).toHaveBeenCalledWith(AUTH_TYPE_KEY, orderedTypes);
  });

  it('should handle duplicate AuthTypes', () => {
    Auth(AuthType.Bearer, AuthType.Bearer);

    expect(mockSetMetadata).toHaveBeenCalledWith(AUTH_TYPE_KEY, [
      AuthType.Bearer,
      AuthType.Bearer,
    ]);
  });

  it('should return a decorator function', () => {
    const result = Auth(AuthType.Bearer);

    expect(typeof result).toBe('function');
    expect(mockSetMetadata).toHaveBeenCalledWith(AUTH_TYPE_KEY, [
      AuthType.Bearer,
    ]);
  });

  it('should use the correct metadata key', () => {
    Auth(AuthType.Bearer);

    expect(mockSetMetadata).toHaveBeenCalledWith(
      AUTH_TYPE_KEY,
      expect.any(Array),
    );
  });
});
