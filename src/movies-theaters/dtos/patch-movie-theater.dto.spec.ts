import { validate } from 'class-validator';
import { PatchMovieTheaterDto } from './patch-movie-theater.dto';

describe('PatchMovieTheaterDto', () => {
  let dto: PatchMovieTheaterDto;

  beforeEach(() => {
    dto = new PatchMovieTheaterDto();
  });

  it('should be defined', () => {
    expect(dto).toBeDefined();
  });

  it('should extend CreateMovieTheaterDto', () => {
    expect(dto).toHaveProperty('numberSeats');
    expect(dto).toHaveProperty('numberSeatsDisabled');
    expect(dto).toHaveProperty('roomNumber');
    expect(dto).toHaveProperty('theaterId');
  });

  describe('Valid DTO - Partial Updates', () => {
    it('should pass validation with partial data - numberSeats only', async () => {
      dto.numberSeats = 250;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with partial data - roomNumber only', async () => {
      dto.roomNumber = 3;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with partial data - theaterId only', async () => {
      dto.theaterId = 2;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with partial data - numberSeatsDisabled only', async () => {
      dto.numberSeatsDisabled = 5;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with multiple optional fields', async () => {
      dto.numberSeats = 400;
      dto.roomNumber = 7;
      dto.numberSeatsDisabled = 15;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with empty DTO (all fields optional)', async () => {
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with all fields', async () => {
      dto.numberSeats = 300;
      dto.numberSeatsDisabled = 10;
      dto.roomNumber = 5;
      dto.theaterId = 1;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });

  describe('Invalid DTO', () => {
    it('should fail validation with invalid numberSeats type', async () => {
      Object.assign(dto, { numberSeats: 'invalid' });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('numberSeats');
    });

    it('should fail validation with invalid roomNumber type', async () => {
      Object.assign(dto, { roomNumber: 'invalid' });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('roomNumber');
    });

    it('should fail validation with invalid theaterId type', async () => {
      Object.assign(dto, { theaterId: 'invalid' });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('theaterId');
    });

    it('should fail validation with invalid numberSeatsDisabled type', async () => {
      Object.assign(dto, { numberSeatsDisabled: 'invalid' });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('numberSeatsDisabled');
    });

    it('should fail validation with negative numbers', async () => {
      dto.numberSeats = -300;
      dto.roomNumber = -5;
      dto.theaterId = -1;

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });
});
