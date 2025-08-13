import { MovieTheater } from './movie-theater.entity';
import { Theater } from '../theaters/theater.entity';
import { SessionCinema } from '../sessions-cinemas/session-cinema.entity';

describe('MovieTheater Entity', () => {
  let movieTheater: MovieTheater;

  beforeEach(() => {
    movieTheater = new MovieTheater();
  });

  it('should be defined', () => {
    expect(movieTheater).toBeDefined();
  });

  it('should have correct properties', () => {
    expect(movieTheater).toHaveProperty('id');
    expect(movieTheater).toHaveProperty('theater');
    expect(movieTheater).toHaveProperty('theaterId');
    expect(movieTheater).toHaveProperty('numberSeats');
    expect(movieTheater).toHaveProperty('numberSeatsDisabled');
    expect(movieTheater).toHaveProperty('roomNumber');
    expect(movieTheater).toHaveProperty('sessionsCinema');
  });

  it('should set theaterId correctly', () => {
    const theaterId = 123;
    movieTheater.theaterId = theaterId;
    expect(movieTheater.theaterId).toBe(theaterId);
  });

  it('should set numberSeats correctly', () => {
    const numberSeats = 200;
    movieTheater.numberSeats = numberSeats;
    expect(movieTheater.numberSeats).toBe(numberSeats);
  });

  it('should set numberSeatsDisabled correctly', () => {
    const numberSeatsDisabled = 10;
    movieTheater.numberSeatsDisabled = numberSeatsDisabled;
    expect(movieTheater.numberSeatsDisabled).toBe(numberSeatsDisabled);
  });

  it('should set roomNumber correctly', () => {
    const roomNumber = 5;
    movieTheater.roomNumber = roomNumber;
    expect(movieTheater.roomNumber).toBe(roomNumber);
  });

  it('should set theater relationship correctly', () => {
    const theater = new Theater();
    theater.id = 1;
    movieTheater.theater = theater;
    expect(movieTheater.theater).toBe(theater);
    expect(movieTheater.theater.id).toBe(1);
  });

  it('should handle sessionsCinema relationship correctly', () => {
    const sessionCinema1 = new SessionCinema();
    const sessionCinema2 = new SessionCinema();
    movieTheater.sessionsCinema = [sessionCinema1, sessionCinema2];

    expect(movieTheater.sessionsCinema).toHaveLength(2);
    expect(movieTheater.sessionsCinema[0]).toBe(sessionCinema1);
    expect(movieTheater.sessionsCinema[1]).toBe(sessionCinema2);
  });

  it('should have default value for numberSeatsDisabled', () => {
    expect(movieTheater.numberSeatsDisabled).toBeUndefined();
  });
});
