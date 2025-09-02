import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { GoogleTokenDto } from './google-token.dto';

describe('GoogleTokenDto', () => {
  let dto: GoogleTokenDto;

  beforeEach(() => {
    dto = new GoogleTokenDto();
  });

  it('should be defined', () => {
    expect(dto).toBeDefined();
  });

  it('should have correct properties', () => {
    expect(dto).toHaveProperty('token');
  });

  it('should validate successfully with valid token', async () => {
    Object.assign(dto, {
      token: 'valid-google-token-12345',
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should fail validation when token is missing', async () => {
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('token');
  });

  it('should fail validation when token is empty string', async () => {
    Object.assign(dto, {
      token: '',
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('token');
  });

  it('should fail validation when token is null', async () => {
    Object.assign(dto, {
      token: null,
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('token');
  });

  it('should fail validation when token is undefined', async () => {
    Object.assign(dto, {
      token: undefined,
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('token');
  });

  it('should validate with various token formats', async () => {
    const validTokens = [
      'google-oauth-token-123',
      'eyJhbGciOiJSUzI1NiIsImtpZCI6IjE2NzAyNzYxMj',
      'ya29.a0AfH6SMBvXkJdQqJ5R3',
      'token123',
      'simple-token',
      'very.long.token.with.dots.and.numbers.123456789',
    ];

    for (const token of validTokens) {
      Object.assign(dto, { token });
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    }
  });

  it('should handle whitespace-only token as invalid', async () => {
    const data = { token: '   ' };
    const transformedDto = plainToClass(GoogleTokenDto, data);

    const errors = await validate(transformedDto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('token');
  });

  it('should validate with very long tokens', async () => {
    const longToken = 'a'.repeat(1000);
    Object.assign(dto, {
      token: longToken,
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should handle special characters in token', async () => {
    const tokenWithSpecialChars = 'token-with_special.chars@domain.com/123!';
    Object.assign(dto, {
      token: tokenWithSpecialChars,
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should validate Google OAuth token format', async () => {
    const googleToken =
      'ya29.a0AfH6SMBvXkJdQqJ5R3tYQZ1234567890abcdefghijklmnopqrstuvwxyz';
    Object.assign(dto, {
      token: googleToken,
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should validate JWT-like Google tokens', async () => {
    const jwtLikeToken =
      'eyJhbGciOiJSUzI1NiIsImtpZCI6IjE2NzAyNzYxMjMiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJjbGllbnRfaWQifQ.signature';
    Object.assign(dto, {
      token: jwtLikeToken,
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should handle numeric token values', async () => {
    Object.assign(dto, {
      token: 123456789,
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('token');
  });

  it('should handle boolean token values', async () => {
    Object.assign(dto, {
      token: true,
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('token');
  });

  it('should handle object token values', async () => {
    Object.assign(dto, {
      token: { invalidToken: 'value' },
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('token');
  });

  it('should handle array token values', async () => {
    Object.assign(dto, {
      token: ['token1', 'token2'],
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('token');
  });
});
