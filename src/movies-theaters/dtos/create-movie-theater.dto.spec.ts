import { validate } from 'class-validator';
import { CreateMovieTheaterDto } from './create-movie-theater.dto';

describe('CreateMovieTheaterDto', () => {
  let dto: CreateMovieTheaterDto;

  beforeEach(() => {
    dto = new CreateMovieTheaterDto();
  });

  it('should be defined', () => {
    expect(dto).toBeDefined();
  });

  describe('Valid DTO', () => {
    it('should pass validation with valid data', async () => {
      dto.numberSeats = 300;
      dto.roomNumber = 5;
      dto.theaterId = 1;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with optional numberSeatsDisabled', async () => {
      dto.numberSeats = 300;
      dto.numberSeatsDisabled = 10;
      dto.roomNumber = 5;
      dto.theaterId = 1;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation without optional numberSeatsDisabled', async () => {
      dto.numberSeats = 300;
      dto.roomNumber = 5;
      dto.theaterId = 1;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });

  describe('Invalid DTO', () => {
    it('should fail validation with invalid numberSeats type', async () => {
      Object.assign(dto, { numberSeats: 'invalid' });
      dto.roomNumber = 5;
      dto.theaterId = 1;

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('numberSeats');
    });

    it('should fail validation with invalid roomNumber type', async () => {
      dto.numberSeats = 300;
      Object.assign(dto, { roomNumber: 'invalid' });
      dto.theaterId = 1;

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('roomNumber');
    });

    it('should fail validation with invalid theaterId type', async () => {
      dto.numberSeats = 300;
      dto.roomNumber = 5;
      Object.assign(dto, { theaterId: 'invalid' });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('theaterId');
    });

    it('should fail validation with invalid numberSeatsDisabled type', async () => {
      dto.numberSeats = 300;
      Object.assign(dto, { numberSeatsDisabled: 'invalid' });
      dto.roomNumber = 5;
      dto.theaterId = 1;

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('numberSeatsDisabled');
    });

    it('should fail validation with missing required fields', async () => {
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);

      const properties = errors.map((error) => error.property);
      expect(properties).toContain('numberSeats');
      expect(properties).toContain('roomNumber');
      expect(properties).toContain('theaterId');
    });

    it('should fail validation with negative numbers', async () => {
      dto.numberSeats = -300;
      dto.roomNumber = -5;
      dto.theaterId = -1;

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should fail validation with zero values', async () => {
      dto.numberSeats = 0;
      dto.roomNumber = 0;
      dto.theaterId = 0;

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });
});
