import { validate } from 'class-validator';
import { PriceDto } from './create-price.dto';
import { TheaterQuality } from '../enums/theaters-qualities.enum';

describe('PriceDto', () => {
  let dto: PriceDto;

  beforeEach(() => {
    dto = new PriceDto();
  });

  it('should be defined', () => {
    expect(dto).toBeDefined();
  });

  describe('Valid DTO', () => {
    it('should pass validation with valid data', async () => {
      dto.theaterQuality = TheaterQuality.DOLBY_CINEMA;
      dto.price = 12.5;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with different theater qualities', async () => {
      const qualities = [
        TheaterQuality.SD,
        TheaterQuality.HD,
        TheaterQuality.FULL_HD,
        TheaterQuality.UHD_4K,
        TheaterQuality.UHD_8K,
        TheaterQuality.IMAX,
        TheaterQuality.DOLBY_CINEMA,
        TheaterQuality.THREE_D,
      ];

      for (const quality of qualities) {
        dto.theaterQuality = quality;
        dto.price = 10.0;

        const errors = await validate(dto);
        expect(errors).toHaveLength(0);
      }
    });

    it('should pass validation with different price values', async () => {
      const prices = [5.0, 8.5, 10, 12.99, 15.5, 20];

      for (const price of prices) {
        dto.theaterQuality = TheaterQuality.HD;
        dto.price = price;

        const errors = await validate(dto);
        expect(errors).toHaveLength(0);
      }
    });

    it('should pass validation with integer prices', async () => {
      dto.theaterQuality = TheaterQuality.IMAX;
      dto.price = 15;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with decimal prices', async () => {
      dto.theaterQuality = TheaterQuality.THREE_D;
      dto.price = 9.99;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });

  describe('Invalid DTO', () => {
    it('should fail validation with invalid theaterQuality', async () => {
      Object.assign(dto, { theaterQuality: 'INVALID_QUALITY' });
      dto.price = 12.5;

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('theaterQuality');
    });

    it('should fail validation with invalid price type', async () => {
      dto.theaterQuality = TheaterQuality.HD;
      Object.assign(dto, { price: 'invalid_price' });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('price');
    });

    it('should fail validation with missing required fields', async () => {
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);

      const properties = errors.map((error) => error.property);
      expect(properties).toContain('theaterQuality');
      expect(properties).toContain('price');
    });

    it('should fail validation with empty theaterQuality', async () => {
      Object.assign(dto, { theaterQuality: '' });
      dto.price = 12.5;

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('theaterQuality');
    });

    it('should fail validation with negative price', async () => {
      dto.theaterQuality = TheaterQuality.HD;
      dto.price = -10;

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should fail validation with zero price', async () => {
      dto.theaterQuality = TheaterQuality.HD;
      dto.price = 0;

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });
});
