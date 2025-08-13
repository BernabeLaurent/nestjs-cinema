import { validate } from 'class-validator';
import { CreateSessionCinemaDto } from './create-session-cinema.dto';
import { TheaterQuality } from '../enums/theaters-qualities.enum';
import { Languages } from '../../common/enums/languages.enum';

describe('CreateSessionCinemaDto', () => {
  let dto: CreateSessionCinemaDto;

  beforeEach(() => {
    dto = new CreateSessionCinemaDto();
  });

  it('should be defined', () => {
    expect(dto).toBeDefined();
  });

  describe('Valid DTO', () => {
    it('should pass validation with valid data', async () => {
      dto.startTime = new Date('2024-01-01T20:00:00Z');
      dto.endTime = new Date('2024-01-01T22:00:00Z');
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
        dto.startTime = new Date('2024-01-01T20:00:00Z');
        dto.endTime = new Date('2024-01-01T22:00:00Z');
        dto.quality = quality;
        dto.codeLanguage = Languages.FRENCH;
        dto.movieTheaterId = 1;
        dto.movieId = 1;

        const errors = await validate(dto);
        expect(errors).toHaveLength(0);
      }
    });

    it('should pass validation with different languages', async () => {
      dto.startTime = new Date('2024-01-01T20:00:00Z');
      dto.endTime = new Date('2024-01-01T22:00:00Z');
      dto.quality = TheaterQuality.HD;
      dto.movieTheaterId = 1;
      dto.movieId = 1;

      const languages = [
        Languages.FRENCH,
        Languages.ENGLISH,
        Languages.SPANISH,
      ];

      for (const language of languages) {
        dto.codeLanguage = language;
        const errors = await validate(dto);
        expect(errors).toHaveLength(0);
      }
    });

    it('should pass validation with different time ranges', async () => {
      dto.quality = TheaterQuality.HD;
      dto.codeLanguage = Languages.FRENCH;
      dto.movieTheaterId = 1;
      dto.movieId = 1;

      const timeRanges = [
        {
          start: new Date('2024-01-01T14:00:00Z'),
          end: new Date('2024-01-01T16:00:00Z'),
        },
        {
          start: new Date('2024-01-01T20:30:00Z'),
          end: new Date('2024-01-01T22:30:00Z'),
        },
        {
          start: new Date('2024-01-01T09:00:00Z'),
          end: new Date('2024-01-01T11:30:00Z'),
        },
      ];

      for (const timeRange of timeRanges) {
        dto.startTime = timeRange.start;
        dto.endTime = timeRange.end;
        const errors = await validate(dto);
        expect(errors).toHaveLength(0);
      }
    });
  });

  describe('Invalid DTO', () => {
    it('should fail validation with invalid startTime type', async () => {
      Object.assign(dto, { startTime: 'invalid_date' });
      dto.endTime = new Date('2024-01-01T22:00:00Z');
      dto.quality = TheaterQuality.HD;
      dto.codeLanguage = Languages.FRENCH;
      dto.movieTheaterId = 1;
      dto.movieId = 1;

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('startTime');
    });

    it('should fail validation with invalid endTime type', async () => {
      dto.startTime = new Date('2024-01-01T20:00:00Z');
      Object.assign(dto, { endTime: 'invalid_date' });
      dto.quality = TheaterQuality.HD;
      dto.codeLanguage = Languages.FRENCH;
      dto.movieTheaterId = 1;
      dto.movieId = 1;

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('endTime');
    });

    it('should fail validation with invalid quality', async () => {
      dto.startTime = new Date('2024-01-01T20:00:00Z');
      dto.endTime = new Date('2024-01-01T22:00:00Z');
      Object.assign(dto, { quality: 'INVALID_QUALITY' });
      dto.codeLanguage = Languages.FRENCH;
      dto.movieTheaterId = 1;
      dto.movieId = 1;

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('quality');
    });

    it('should fail validation with invalid codeLanguage', async () => {
      dto.startTime = new Date('2024-01-01T20:00:00Z');
      dto.endTime = new Date('2024-01-01T22:00:00Z');
      dto.quality = TheaterQuality.HD;
      Object.assign(dto, { codeLanguage: 'INVALID_LANGUAGE' });
      dto.movieTheaterId = 1;
      dto.movieId = 1;

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('codeLanguage');
    });

    it('should fail validation with invalid movieTheaterId type', async () => {
      dto.startTime = new Date('2024-01-01T20:00:00Z');
      dto.endTime = new Date('2024-01-01T22:00:00Z');
      dto.quality = TheaterQuality.HD;
      dto.codeLanguage = Languages.FRENCH;
      Object.assign(dto, { movieTheaterId: 'invalid' });
      dto.movieId = 1;

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('movieTheaterId');
    });

    it('should fail validation with invalid movieId type', async () => {
      dto.startTime = new Date('2024-01-01T20:00:00Z');
      dto.endTime = new Date('2024-01-01T22:00:00Z');
      dto.quality = TheaterQuality.HD;
      dto.codeLanguage = Languages.FRENCH;
      dto.movieTheaterId = 1;
      Object.assign(dto, { movieId: 'invalid' });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('movieId');
    });

    it('should fail validation with missing required fields', async () => {
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);

      const properties = errors.map((error) => error.property);
      expect(properties).toContain('startTime');
      expect(properties).toContain('endTime');
      expect(properties).toContain('quality');
      expect(properties).toContain('codeLanguage');
      expect(properties).toContain('movieTheaterId');
      expect(properties).toContain('movieId');
    });

    it('should fail validation with negative IDs', async () => {
      dto.startTime = new Date('2024-01-01T20:00:00Z');
      dto.endTime = new Date('2024-01-01T22:00:00Z');
      dto.quality = TheaterQuality.HD;
      dto.codeLanguage = Languages.FRENCH;
      dto.movieTheaterId = -1;
      dto.movieId = -1;

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });
});
