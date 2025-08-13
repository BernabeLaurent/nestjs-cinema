import { validate } from 'class-validator';
import { SendEmailDto } from './send-email.dto';

describe('SendEmailDto', () => {
  let dto: SendEmailDto;

  beforeEach(() => {
    dto = new SendEmailDto();
  });

  it('should be defined', () => {
    expect(dto).toBeDefined();
  });

  describe('Valid DTO', () => {
    it('should pass validation with valid data', async () => {
      dto.email = 'test@example.com';
      dto.subject = 'Test Subject';
      dto.template = 'confirmation_inscription';
      dto.userId = 1;
      dto.context = { name: 'John', age: 30 } as Record<string, any>;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation without optional context', async () => {
      dto.email = 'test@example.com';
      dto.subject = 'Test Subject';
      dto.template = 'confirmation_inscription';
      dto.userId = 1;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });

  describe('Invalid DTO', () => {
    it('should fail validation with invalid email', async () => {
      dto.email = 'invalid-email';
      dto.subject = 'Test Subject';
      dto.template = 'confirmation_inscription';
      dto.userId = 1;

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('email');
    });

    it('should fail validation with empty email', async () => {
      dto.email = '';
      dto.subject = 'Test Subject';
      dto.template = 'confirmation_inscription';
      dto.userId = 1;

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('email');
    });

    it('should fail validation with empty subject', async () => {
      dto.email = 'test@example.com';
      dto.subject = '';
      dto.template = 'confirmation_inscription';
      dto.userId = 1;

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('subject');
    });

    it('should fail validation with empty template', async () => {
      dto.email = 'test@example.com';
      dto.subject = 'Test Subject';
      dto.template = '';
      dto.userId = 1;

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('template');
    });

    it('should fail validation with invalid userId type', async () => {
      dto.email = 'test@example.com';
      dto.subject = 'Test Subject';
      dto.template = 'confirmation_inscription';
      dto.userId = 'invalid' as unknown as number;

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('userId');
    });

    it('should fail validation with missing required fields', async () => {
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);

      const properties = errors.map((error) => error.property);
      expect(properties).toContain('email');
      expect(properties).toContain('subject');
      expect(properties).toContain('template');
      expect(properties).toContain('userId');
    });
  });
});
