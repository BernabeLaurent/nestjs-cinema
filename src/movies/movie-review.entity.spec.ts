import { MovieReview } from './movie-review.entity';
import { Movie } from './movie.entity';
import { User } from '../users/user.entity';

describe('MovieReview Entity', () => {
  let movieReview: MovieReview;

  beforeEach(() => {
    movieReview = new MovieReview();
  });

  it('should be defined', () => {
    expect(movieReview).toBeDefined();
  });

  it('should have correct properties', () => {
    expect(movieReview).toHaveProperty('id');
    expect(movieReview).toHaveProperty('userId');
    expect(movieReview).toHaveProperty('user');
    expect(movieReview).toHaveProperty('movieId');
    expect(movieReview).toHaveProperty('movie');
    expect(movieReview).toHaveProperty('note');
    expect(movieReview).toHaveProperty('isValidated');
    expect(movieReview).toHaveProperty('createDate');
    expect(movieReview).toHaveProperty('updateDate');
    expect(movieReview).toHaveProperty('deleteDate');
  });

  it('should set userId correctly', () => {
    const userId = 123;
    movieReview.userId = userId;
    expect(movieReview.userId).toBe(userId);
  });

  it('should set movieId correctly', () => {
    const movieId = 456;
    movieReview.movieId = movieId;
    expect(movieReview.movieId).toBe(movieId);
  });

  it('should set note correctly', () => {
    const note = 8;
    movieReview.note = note;
    expect(movieReview.note).toBe(note);
  });

  it('should set isValidated correctly', () => {
    movieReview.isValidated = true;
    expect(movieReview.isValidated).toBe(true);
  });

  it('should set user relationship correctly', () => {
    const user = new User();
    user.id = 1;
    movieReview.user = user;
    expect(movieReview.user).toBe(user);
    expect(movieReview.user.id).toBe(1);
  });

  it('should set movie relationship correctly', () => {
    const movie = new Movie();
    movie.id = 2;
    movieReview.movie = movie;
    expect(movieReview.movie).toBe(movie);
    expect(movieReview.movie.id).toBe(2);
  });

  it('should set dates correctly', () => {
    const now = new Date();
    movieReview.createDate = now;
    movieReview.updateDate = now;
    expect(movieReview.createDate).toBe(now);
    expect(movieReview.updateDate).toBe(now);
  });

  it('should handle note validation range', () => {
    movieReview.note = 0;
    expect(movieReview.note).toBe(0);

    movieReview.note = 10;
    expect(movieReview.note).toBe(10);

    movieReview.note = 5;
    expect(movieReview.note).toBe(5);
  });
});
