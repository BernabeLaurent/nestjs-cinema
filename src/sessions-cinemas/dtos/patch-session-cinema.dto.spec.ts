import { validate } from 'class-validator';
import { PatchSessionCinemaDto } from './patch-session-cinema.dto';
import { TheaterQuality } from '../enums/theaters-qualities.enum';
import { Languages } from '../../common/enums/languages.enum';

describe('PatchSessionCinemaDto', () => {
  let dto: PatchSessionCinemaDto;

  beforeEach(() => {
    dto = new PatchSessionCinemaDto();
  });

  it('should be defined', () => {
    expect(dto).toBeDefined();
  });

  it('should extend CreateSessionCinemaDto', () => {
    // With PartialType, properties are optional and may not be initialized
    // We test that the DTO accepts properties from CreateSessionCinemaDto
    dto.startTime = '20:00';
    dto.endTime = '22:00';
    dto.quality = TheaterQuality.IMAX;
    dto.codeLanguage = Languages.FRENCH;
    dto.movieTheaterId = 1;
    dto.movieId = 1;

    expect(dto.startTime).toBe('20:00');
    expect(dto.endTime).toBe('22:00');
    expect(dto.quality).toBe(TheaterQuality.IMAX);
    expect(dto.codeLanguage).toBe(Languages.FRENCH);
    expect(dto.movieTheaterId).toBe(1);
    expect(dto.movieId).toBe(1);
  });

  describe('Valid DTO - Partial Updates', () => {
    it('should pass validation with partial data - startTime only', async () => {
      dto.startTime = '21:00';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with partial data - endTime only', async () => {
      dto.endTime = '23:00';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with partial data - quality only', async () => {
      dto.quality = TheaterQuality.IMAX;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with partial data - codeLanguage only', async () => {
      dto.codeLanguage = Languages.ENGLISH;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with partial data - movieTheaterId only', async () => {
      dto.movieTheaterId = 2;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with partial data - movieId only', async () => {
      dto.movieId = 3;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with multiple optional fields', async () => {
      dto.startTime = '19:00';
      dto.quality = TheaterQuality.UHD_4K;
      dto.codeLanguage = Languages.SPANISH;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with empty DTO (all fields optional)', async () => {
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with all fields', async () => {
      dto.startTime = '20:00';
      dto.endTime = '22:00';
      dto.quality = TheaterQuality.DOLBY_CINEMA;
      dto.codeLanguage = Languages.FRENCH;
      dto.movieTheaterId = 1;
      dto.movieId = 1;

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
        dto.quality = quality;
        const errors = await validate(dto);
        expect(errors).toHaveLength(0);
      }
    });
  });

  describe('Invalid DTO', () => {
    it('should fail validation with invalid startTime type', async () => {
      Object.assign(dto, { startTime: 123 });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('startTime');
    });

    it('should fail validation with invalid endTime type', async () => {
      Object.assign(dto, { endTime: 123 });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('endTime');
    });

    it('should fail validation with invalid quality', async () => {
      Object.assign(dto, { quality: 'INVALID_QUALITY' });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('quality');
    });

    it('should fail validation with invalid codeLanguage', async () => {
      Object.assign(dto, { codeLanguage: 'INVALID_LANGUAGE' });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('codeLanguage');
    });

    it('should fail validation with invalid movieTheaterId type', async () => {
      Object.assign(dto, { movieTheaterId: 'invalid' });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('movieTheaterId');
    });

    it('should fail validation with invalid movieId type', async () => {
      Object.assign(dto, { movieId: 'invalid' });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('movieId');
    });

    it('should fail validation with negative IDs', async () => {
      dto.movieTheaterId = -1;
      dto.movieId = -1;

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should fail validation with decimal IDs', async () => {
      Object.assign(dto, { movieTheaterId: 1.5 });
      Object.assign(dto, { movieId: 2.7 });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });
});
