import { validate } from 'class-validator';
import { GetTheaterDto } from './get-theater.dto';

describe('GetTheaterDto', () => {
  let dto: GetTheaterDto;

  beforeEach(() => {
    dto = new GetTheaterDto();
  });

  describe('id', () => {
    it('should be valid with correct integer id', async () => {
      dto.id = 1;

      const errors = await validate(dto);
      const idErrors = errors.filter((error) => error.property === 'id');
      expect(idErrors).toHaveLength(0);
    });

    it('should be valid with larger integer id', async () => {
      dto.id = 999999;

      const errors = await validate(dto);
      const idErrors = errors.filter((error) => error.property === 'id');
      expect(idErrors).toHaveLength(0);
    });

    it('should fail when id is not an integer', async () => {
      const invalidDto = Object.assign(new GetTheaterDto(), { id: '1' });

      const errors = await validate(invalidDto);
      const idErrors = errors.filter((error) => error.property === 'id');
      expect(idErrors.length).toBeGreaterThan(0);
    });

    it('should fail when id is a float', async () => {
      const invalidDto = Object.assign(new GetTheaterDto(), { id: 1.5 });

      const errors = await validate(invalidDto);
      const idErrors = errors.filter((error) => error.property === 'id');
      expect(idErrors.length).toBeGreaterThan(0);
    });

    it('should be valid with zero as id (if allowed)', async () => {
      dto.id = 0;

      const errors = await validate(dto);
      const idErrors = errors.filter((error) => error.property === 'id');
      expect(idErrors).toHaveLength(0);
    });

    it('should be valid with negative id (if allowed)', async () => {
      dto.id = -1;

      const errors = await validate(dto);
      const idErrors = errors.filter((error) => error.property === 'id');
      expect(idErrors).toHaveLength(0);
    });

    it('should fail when id is null', async () => {
      const invalidDto = Object.assign(new GetTheaterDto(), { id: null });

      const errors = await validate(invalidDto);
      const idErrors = errors.filter((error) => error.property === 'id');
      expect(idErrors.length).toBeGreaterThan(0);
    });

    it('should fail when id is undefined', async () => {
      const invalidDto = Object.assign(new GetTheaterDto(), { id: undefined });

      const errors = await validate(invalidDto);
      const idErrors = errors.filter((error) => error.property === 'id');
      expect(idErrors.length).toBeGreaterThan(0);
    });

    it('should fail when id is an object', async () => {
      const invalidDto = Object.assign(new GetTheaterDto(), {
        id: { value: 1 },
      });

      const errors = await validate(invalidDto);
      const idErrors = errors.filter((error) => error.property === 'id');
      expect(idErrors.length).toBeGreaterThan(0);
    });

    it('should fail when id is an array', async () => {
      const invalidDto = Object.assign(new GetTheaterDto(), { id: [1] });

      const errors = await validate(invalidDto);
      const idErrors = errors.filter((error) => error.property === 'id');
      expect(idErrors.length).toBeGreaterThan(0);
    });

    it('should fail when id is boolean', async () => {
      const invalidDto = Object.assign(new GetTheaterDto(), { id: true });

      const errors = await validate(invalidDto);
      const idErrors = errors.filter((error) => error.property === 'id');
      expect(idErrors.length).toBeGreaterThan(0);
    });
  });

  describe('complete dto validation', () => {
    it('should be completely valid with correct id', async () => {
      dto.id = 42;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should have only id property validation errors when id is invalid', async () => {
      const invalidDto = Object.assign(new GetTheaterDto(), { id: 'invalid' });

      const errors = await validate(invalidDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('id');
    });
  });
});
