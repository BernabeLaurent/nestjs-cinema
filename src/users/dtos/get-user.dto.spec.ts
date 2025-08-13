import { validate } from 'class-validator';
import { GetUserDto } from './get-user.dto';

describe('GetUserDto', () => {
  let dto: GetUserDto;

  beforeEach(() => {
    dto = new GetUserDto();
  });

  it('should be defined', () => {
    expect(dto).toBeDefined();
  });

  describe('Valid DTO', () => {
    it('should pass validation with valid integer id', async () => {
      dto.id = 1;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with large integer id', async () => {
      dto.id = 9999999;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });

  describe('Invalid DTO', () => {
    it('should fail validation with non-integer id', async () => {
      Object.assign(dto, { id: 1.5 });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('id');
    });

    it('should fail validation with string id', async () => {
      Object.assign(dto, { id: 'not-a-number' });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('id');
    });

    it('should fail validation with negative id', async () => {
      dto.id = -1;

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('id');
    });

    it('should fail validation with zero id', async () => {
      dto.id = 0;

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('id');
    });
  });
});
