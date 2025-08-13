import { SessionCinema } from './session-cinema.entity';
import { TheaterQuality } from './enums/theaters-qualities.enum';
import { Languages } from '../common/enums/languages.enum';
import { MovieTheater } from '../movies-theaters/movie-theater.entity';
import { Movie } from '../movies/movie.entity';
import { Booking } from '../bookings/booking.entity';

describe('SessionCinema Entity', () => {
  let sessionCinema: SessionCinema;

  beforeEach(() => {
    sessionCinema = new SessionCinema();
  });

  it('should be defined', () => {
    expect(sessionCinema).toBeDefined();
  });

  it('should have correct properties', () => {
    expect(sessionCinema).toHaveProperty('id');
    expect(sessionCinema).toHaveProperty('startTime');
    expect(sessionCinema).toHaveProperty('endTime');
    expect(sessionCinema).toHaveProperty('quality');
    expect(sessionCinema).toHaveProperty('codeLanguage');
    expect(sessionCinema).toHaveProperty('movieTheater');
    expect(sessionCinema).toHaveProperty('movieTheaterId');
    expect(sessionCinema).toHaveProperty('movie');
    expect(sessionCinema).toHaveProperty('movieId');
    expect(sessionCinema).toHaveProperty('bookings');
  });

  it('should set startTime correctly', () => {
    const startTime = new Date('2024-01-01T20:00:00Z');
    sessionCinema.startTime = startTime;
    expect(sessionCinema.startTime).toBe(startTime);
  });

  it('should set endTime correctly', () => {
    const endTime = new Date('2024-01-01T22:00:00Z');
    sessionCinema.endTime = endTime;
    expect(sessionCinema.endTime).toBe(endTime);
  });

  it('should set quality correctly', () => {
    sessionCinema.quality = TheaterQuality.UHD_4K;
    expect(sessionCinema.quality).toBe(TheaterQuality.UHD_4K);
  });

  it('should set codeLanguage correctly', () => {
    sessionCinema.codeLanguage = Languages.FRENCH;
    expect(sessionCinema.codeLanguage).toBe(Languages.FRENCH);
  });

  it('should set movieTheaterId correctly', () => {
    const movieTheaterId = 123;
    sessionCinema.movieTheaterId = movieTheaterId;
    expect(sessionCinema.movieTheaterId).toBe(movieTheaterId);
  });

  it('should set movieId correctly', () => {
    const movieId = 456;
    sessionCinema.movieId = movieId;
    expect(sessionCinema.movieId).toBe(movieId);
  });

  it('should set movieTheater relationship correctly', () => {
    const movieTheater = new MovieTheater();
    movieTheater.id = 1;
    sessionCinema.movieTheater = movieTheater;
    expect(sessionCinema.movieTheater).toBe(movieTheater);
    expect(sessionCinema.movieTheater.id).toBe(1);
  });

  it('should set movie relationship correctly', () => {
    const movie = new Movie();
    movie.id = 2;
    sessionCinema.movie = movie;
    expect(sessionCinema.movie).toBe(movie);
    expect(sessionCinema.movie.id).toBe(2);
  });

  it('should handle bookings relationship correctly', () => {
    const booking1 = new Booking();
    const booking2 = new Booking();
    sessionCinema.bookings = [booking1, booking2];

    expect(sessionCinema.bookings).toHaveLength(2);
    expect(sessionCinema.bookings[0]).toBe(booking1);
    expect(sessionCinema.bookings[1]).toBe(booking2);
  });

  it('should handle different theater qualities', () => {
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

    qualities.forEach((quality) => {
      sessionCinema.quality = quality;
      expect(sessionCinema.quality).toBe(quality);
    });
  });

  it('should handle different languages', () => {
    sessionCinema.codeLanguage = Languages.ENGLISH;
    expect(sessionCinema.codeLanguage).toBe(Languages.ENGLISH);

    sessionCinema.codeLanguage = Languages.SPANISH;
    expect(sessionCinema.codeLanguage).toBe(Languages.SPANISH);
  });
});
