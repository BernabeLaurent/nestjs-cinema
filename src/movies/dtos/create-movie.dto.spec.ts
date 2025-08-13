import { validate } from 'class-validator';
import { CreateMovieDto } from './create-movie.dto';
import { Languages } from '../../common/enums/languages.enum';

describe('CreateMovieDto', () => {
  let dto: CreateMovieDto;

  beforeEach(() => {
    dto = new CreateMovieDto();
  });

  it('should be defined', () => {
    expect(dto).toBeDefined();
  });

  describe('Valid DTO', () => {
    it('should pass validation with valid data', async () => {
      dto.title = 'Test Movie';
      dto.originalTitle = 'Original Test Movie';
      dto.movieExterneId = 12345;
      dto.startDate = new Date('2024-01-01');
      dto.endDate = new Date('2024-12-31');
      dto.originalLanguage = Languages.FRENCH;
      dto.backdropPath = '/backdrop.jpg';
      dto.posterPath = '/poster.jpg';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with optional fields', async () => {
      dto.title = 'Test Movie';
      dto.originalTitle = 'Original Test Movie';
      dto.description = 'A great movie';
      dto.originalDescription = 'Original description';
      dto.tagline = 'Best movie ever';
      dto.originalTagline = 'Original tagline';
      dto.minimumAge = 13;
      dto.runtime = 120;
      dto.averageRating = 8.5;
      dto.isFavorite = true;
      dto.movieExterneId = 12345;
      dto.averageRatingExterne = 9.0;
      dto.releaseDate = new Date('2024-06-01');
      dto.isAdult = false;
      dto.startDate = new Date('2024-01-01');
      dto.endDate = new Date('2024-12-31');
      dto.originalLanguage = Languages.ENGLISH;
      dto.backdropPath = '/backdrop.jpg';
      dto.posterPath = '/poster.jpg';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });

  describe('Invalid DTO', () => {
    it('should fail validation with title too short', async () => {
      dto.title = 'abc';
      dto.originalTitle = 'Original Test Movie';
      dto.movieExterneId = 12345;
      dto.startDate = new Date('2024-01-01');
      dto.endDate = new Date('2024-12-31');
      dto.originalLanguage = Languages.FRENCH;
      dto.backdropPath = '/backdrop.jpg';
      dto.posterPath = '/poster.jpg';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('title');
    });

    it('should fail validation with title too long', async () => {
      dto.title = 'a'.repeat(251);
      dto.originalTitle = 'Original Test Movie';
      dto.movieExterneId = 12345;
      dto.startDate = new Date('2024-01-01');
      dto.endDate = new Date('2024-12-31');
      dto.originalLanguage = Languages.FRENCH;
      dto.backdropPath = '/backdrop.jpg';
      dto.posterPath = '/poster.jpg';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('title');
    });

    it('should fail validation with empty title', async () => {
      dto.title = '';
      dto.originalTitle = 'Original Test Movie';
      dto.movieExterneId = 12345;
      dto.startDate = new Date('2024-01-01');
      dto.endDate = new Date('2024-12-31');
      dto.originalLanguage = Languages.FRENCH;
      dto.backdropPath = '/backdrop.jpg';
      dto.posterPath = '/poster.jpg';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('title');
    });

    it('should fail validation with originalTitle too short', async () => {
      dto.title = 'Test Movie';
      dto.originalTitle = 'abc';
      dto.movieExterneId = 12345;
      dto.startDate = new Date('2024-01-01');
      dto.endDate = new Date('2024-12-31');
      dto.originalLanguage = Languages.FRENCH;
      dto.backdropPath = '/backdrop.jpg';
      dto.posterPath = '/poster.jpg';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('originalTitle');
    });

    it('should fail validation with invalid language', async () => {
      dto.title = 'Test Movie';
      dto.originalTitle = 'Original Test Movie';
      dto.movieExterneId = 12345;
      dto.startDate = new Date('2024-01-01');
      dto.endDate = new Date('2024-12-31');
      Object.assign(dto, { originalLanguage: 'INVALID_LANGUAGE' });
      dto.backdropPath = '/backdrop.jpg';
      dto.posterPath = '/poster.jpg';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('originalLanguage');
    });

    it('should fail validation with missing required fields', async () => {
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);

      const properties = errors.map((error) => error.property);
      expect(properties).toContain('title');
      expect(properties).toContain('originalTitle');
      expect(properties).toContain('movieExterneId');
      expect(properties).toContain('startDate');
      expect(properties).toContain('endDate');
      expect(properties).toContain('originalLanguage');
      expect(properties).toContain('backdropPath');
      expect(properties).toContain('posterPath');
    });
  });
});
