import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { RefreshTokenDto } from './refresh-token.dto';

describe('RefreshTokenDto', () => {
  let dto: RefreshTokenDto;

  beforeEach(() => {
    dto = new RefreshTokenDto();
  });

  it('should be defined', () => {
    expect(dto).toBeDefined();
  });

  it('should have correct properties', () => {
    expect(dto).toHaveProperty('refreshToken');
  });

  it('should validate successfully with valid refresh token', async () => {
    Object.assign(dto, {
      refreshToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjQsInJvbGUiOiJDVVNUT01FUiIsImVtYWlsIjoibG9sb0BleGFtcGxlLmNvbSIsImlhdCI6MTc0NTc0MTEwNywiZXhwIjoxNzQ1NzQ0NzA3LCJhdWQiOiJsb2NhbGhvc3Q6MzMzMyIsImlzcyI6ImxvY2FsaG9zdDozMzMzIn0.a9fS6PqE883os1rrnDun5QRWHk45sWZ05gjOcxh6GOg',
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should fail validation when refreshToken is missing', async () => {
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('refreshToken');
  });

  it('should fail validation when refreshToken is empty string', async () => {
    Object.assign(dto, {
      refreshToken: '',
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('refreshToken');
  });

  it('should fail validation when refreshToken is not a string', async () => {
    Object.assign(dto, {
      refreshToken: 123,
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('refreshToken');
  });

  it('should fail validation when refreshToken is null', async () => {
    Object.assign(dto, {
      refreshToken: null,
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('refreshToken');
  });

  it('should fail validation when refreshToken is undefined', async () => {
    Object.assign(dto, {
      refreshToken: undefined,
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('refreshToken');
  });

  it('should validate with any non-empty string', async () => {
    const validTokens = [
      'simple-token',
      'token-with-dashes',
      'TokenWithCapitals',
      'token123',
      'very.long.token.with.dots',
      'jwt.token.example',
    ];

    for (const token of validTokens) {
      Object.assign(dto, { refreshToken: token });
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    }
  });

  it('should handle whitespace-only strings as invalid', async () => {
    const data = {
      refreshToken: '   ',
    };

    const transformedDto = plainToClass(RefreshTokenDto, data);
    const errors = await validate(transformedDto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('refreshToken');
  });

  it('should handle very long tokens', async () => {
    const longToken = 'a'.repeat(1000);
    Object.assign(dto, {
      refreshToken: longToken,
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should validate JWT-like tokens', async () => {
    const jwtToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

    Object.assign(dto, {
      refreshToken: jwtToken,
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should handle special characters in token', async () => {
    const tokenWithSpecialChars = 'token-with_special.chars@123!';
    Object.assign(dto, {
      refreshToken: tokenWithSpecialChars,
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});
