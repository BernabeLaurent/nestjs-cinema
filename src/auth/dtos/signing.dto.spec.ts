import { validate } from 'class-validator';
import { SignInDto } from './signing.dto';

describe('SignInDto', () => {
  let dto: SignInDto;

  beforeEach(() => {
    dto = new SignInDto();
  });

  it('should be defined', () => {
    expect(dto).toBeDefined();
  });

  it('should have correct properties', () => {
    expect(dto).toHaveProperty('email');
    expect(dto).toHaveProperty('password');
  });

  it('should validate successfully with valid email and password', async () => {
    Object.assign(dto, {
      email: 'test@example.com',
      password: 'L123456789&121',
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should fail validation when email is missing', async () => {
    Object.assign(dto, {
      password: 'validPassword123',
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('email');
  });

  it('should fail validation when password is missing', async () => {
    Object.assign(dto, {
      email: 'test@example.com',
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('password');
  });

  it('should fail validation when email is not a valid email format', async () => {
    Object.assign(dto, {
      email: 'invalid-email',
      password: 'validPassword123',
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('email');
  });

  it('should fail validation when email is empty string', async () => {
    Object.assign(dto, {
      email: '',
      password: 'validPassword123',
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('email');
  });

  it('should fail validation when password is empty string', async () => {
    Object.assign(dto, {
      email: 'test@example.com',
      password: '',
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('password');
  });

  it('should fail validation when email is not a string', async () => {
    Object.assign(dto, {
      email: 123,
      password: 'validPassword123',
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('email');
  });

  it('should fail validation when password is not a string', async () => {
    Object.assign(dto, {
      email: 'test@example.com',
      password: 123,
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('password');
  });

  it('should validate with various valid email formats', async () => {
    const validEmails = [
      'test@example.com',
      'user.name@domain.com',
      'user+tag@example.org',
      'firstname.lastname@subdomain.example.com',
      'user123@test-domain.co.uk',
    ];

    for (const email of validEmails) {
      Object.assign(dto, {
        email,
        password: 'validPassword123',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    }
  });

  it('should fail validation with invalid email formats', async () => {
    const invalidEmails = [
      'plainaddress',
      '@missingusername.com',
      'username@.com',
      'username@com',
      'username..double.dot@example.com',
    ];

    for (const email of invalidEmails) {
      Object.assign(dto, {
        email,
        password: 'validPassword123',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    }
  });

  it('should validate with different password formats', async () => {
    const validPasswords = [
      'simplePassword',
      'Password123',
      'P@ssw0rd!',
      'very_long_password_with_underscores_123',
      'L123456789&121',
    ];

    for (const password of validPasswords) {
      Object.assign(dto, {
        email: 'test@example.com',
        password,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    }
  });

  it('should handle whitespace in email validation', async () => {
    Object.assign(dto, {
      email: '  test@example.com  ',
      password: 'validPassword123',
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should handle whitespace-only password as invalid', async () => {
    Object.assign(dto, {
      email: 'test@example.com',
      password: '   ',
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('password');
  });

  it('should fail validation when both fields are null', async () => {
    Object.assign(dto, {
      email: null,
      password: null,
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some((error) => error.property === 'email')).toBe(true);
    expect(errors.some((error) => error.property === 'password')).toBe(true);
  });
});
