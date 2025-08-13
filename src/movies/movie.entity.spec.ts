import { Movie } from './movie.entity';
import { Languages } from '../common/enums/languages.enum';
import { SessionCinema } from '../sessions-cinemas/session-cinema.entity';
import { MovieReview } from './movie-review.entity';
import { Cast } from './cast.entity';

describe('Movie Entity', () => {
  let movie: Movie;

  beforeEach(() => {
    movie = new Movie();
  });

  it('should be defined', () => {
    expect(movie).toBeDefined();
  });

  it('should have correct properties', () => {
    expect(movie).toHaveProperty('id');
    expect(movie).toHaveProperty('title');
    expect(movie).toHaveProperty('originalTitle');
    expect(movie).toHaveProperty('description');
    expect(movie).toHaveProperty('originalDescription');
    expect(movie).toHaveProperty('tagline');
    expect(movie).toHaveProperty('originalTagline');
    expect(movie).toHaveProperty('minimumAge');
    expect(movie).toHaveProperty('runtime');
    expect(movie).toHaveProperty('averageRating');
    expect(movie).toHaveProperty('isFavorite');
    expect(movie).toHaveProperty('movieExterneId');
    expect(movie).toHaveProperty('averageRatingExterne');
    expect(movie).toHaveProperty('releaseDate');
    expect(movie).toHaveProperty('isAdult');
    expect(movie).toHaveProperty('startDate');
    expect(movie).toHaveProperty('endDate');
    expect(movie).toHaveProperty('originalLanguage');
    expect(movie).toHaveProperty('sessionsCinemas');
    expect(movie).toHaveProperty('reviews');
    expect(movie).toHaveProperty('backdropPath');
    expect(movie).toHaveProperty('posterPath');
    expect(movie).toHaveProperty('cast');
  });

  it('should set title correctly', () => {
    const title = 'Test Movie';
    movie.title = title;
    expect(movie.title).toBe(title);
  });

  it('should set originalTitle correctly', () => {
    const originalTitle = 'Original Test Movie';
    movie.originalTitle = originalTitle;
    expect(movie.originalTitle).toBe(originalTitle);
  });

  it('should set description correctly', () => {
    const description = 'This is a test movie description';
    movie.description = description;
    expect(movie.description).toBe(description);
  });

  it('should set minimumAge correctly', () => {
    const minimumAge = 13;
    movie.minimumAge = minimumAge;
    expect(movie.minimumAge).toBe(minimumAge);
  });

  it('should set runtime correctly', () => {
    const runtime = 120;
    movie.runtime = runtime;
    expect(movie.runtime).toBe(runtime);
  });

  it('should set averageRating correctly', () => {
    const averageRating = 8.5;
    movie.averageRating = averageRating;
    expect(movie.averageRating).toBe(averageRating);
  });

  it('should set isFavorite correctly', () => {
    movie.isFavorite = true;
    expect(movie.isFavorite).toBe(true);
  });

  it('should set movieExterneId correctly', () => {
    const movieExterneId = 12345;
    movie.movieExterneId = movieExterneId;
    expect(movie.movieExterneId).toBe(movieExterneId);
  });

  it('should set isAdult correctly', () => {
    movie.isAdult = false;
    expect(movie.isAdult).toBe(false);
  });

  it('should set originalLanguage correctly', () => {
    movie.originalLanguage = Languages.ENGLISH;
    expect(movie.originalLanguage).toBe(Languages.ENGLISH);
  });

  it('should set dates correctly', () => {
    const now = new Date();
    movie.releaseDate = now;
    movie.startDate = now;
    movie.endDate = now;
    expect(movie.releaseDate).toBe(now);
    expect(movie.startDate).toBe(now);
    expect(movie.endDate).toBe(now);
  });

  it('should set backdropPath correctly', () => {
    const backdropPath = '/path/to/backdrop.jpg';
    movie.backdropPath = backdropPath;
    expect(movie.backdropPath).toBe(backdropPath);
  });

  it('should set posterPath correctly', () => {
    const posterPath = '/path/to/poster.jpg';
    movie.posterPath = posterPath;
    expect(movie.posterPath).toBe(posterPath);
  });

  it('should handle relationships correctly', () => {
    const sessionCinema = new SessionCinema();
    const movieReview = new MovieReview();
    const cast = new Cast();

    movie.sessionsCinemas = [sessionCinema];
    movie.reviews = [movieReview];
    movie.cast = [cast];

    expect(movie.sessionsCinemas).toHaveLength(1);
    expect(movie.reviews).toHaveLength(1);
    expect(movie.cast).toHaveLength(1);
  });
});
