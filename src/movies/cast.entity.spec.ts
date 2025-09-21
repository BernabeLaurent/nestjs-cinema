import { Cast } from './cast.entity';
import { Movie } from './movie.entity';

describe('Cast Entity', () => {
  let cast: Cast;

  beforeEach(() => {
    cast = new Cast();
  });

  it('should be defined', () => {
    expect(cast).toBeDefined();
  });

  it('should have correct properties', () => {
    expect(cast).toHaveProperty('id');
    expect(cast).toHaveProperty('character');
    expect(cast).toHaveProperty('castId');
    expect(cast).toHaveProperty('name');
    expect(cast).toHaveProperty('originalName');
    expect(cast).toHaveProperty('profilePath');
    expect(cast).toHaveProperty('order');
    expect(cast).toHaveProperty('adult');
    expect(cast).toHaveProperty('gender');
    expect(cast).toHaveProperty('movieId');
    expect(cast).toHaveProperty('movie');
  });

  it('should set character correctly', () => {
    const character = 'John Doe';
    cast.character = character;
    expect(cast.character).toBe(character);
  });

  it('should set castId correctly', () => {
    const castId = 123;
    cast.castId = castId;
    expect(cast.castId).toBe(castId);
  });

  it('should set name correctly', () => {
    const name = 'Actor Name';
    cast.name = name;
    expect(cast.name).toBe(name);
  });

  it('should set originalName correctly', () => {
    const originalName = 'Original Actor Name';
    cast.originalName = originalName;
    expect(cast.originalName).toBe(originalName);
  });

  it('should set profilePath correctly', () => {
    const profilePath = '/path/to/profile.jpg';
    cast.profilePath = profilePath;
    expect(cast.profilePath).toBe(profilePath);
  });

  it('should set order correctly', () => {
    const order = 1;
    cast.order = order;
    expect(cast.order).toBe(order);
  });

  it('should set adult correctly', () => {
    cast.adult = true;
    expect(cast.adult).toBe(true);
  });

  it('should set gender correctly', () => {
    const gender = 1;
    cast.gender = gender;
    expect(cast.gender).toBe(gender);
  });

  it('should set movieId correctly', () => {
    const movieId = 456;
    cast.movieId = movieId;
    expect(cast.movieId).toBe(movieId);
  });

  it('should set movie relationship correctly', () => {
    const movie = new Movie();
    movie.id = 1;
    cast.movie = movie;
    expect(cast.movie).toBe(movie);
    expect(cast.movie.id).toBe(1);
  });
});
