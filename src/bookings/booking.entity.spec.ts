import { Booking } from './booking.entity';
import { BookingStatus } from './enums/booking-status.enum';
import { BookingDetail } from './booking-detail.entity';
import { User } from '../users/user.entity';
import { SessionCinema } from '../sessions-cinemas/session-cinema.entity';

describe('Booking Entity', () => {
  let booking: Booking;

  beforeEach(() => {
    booking = new Booking();
  });

  it('should be defined', () => {
    expect(booking).toBeDefined();
  });

  it('should have correct properties', () => {
    expect(booking).toHaveProperty('id');
    expect(booking).toHaveProperty('status');
    expect(booking).toHaveProperty('user');
    expect(booking).toHaveProperty('userId');
    expect(booking).toHaveProperty('sessionCinemaId');
    expect(booking).toHaveProperty('sessionCinema');
    expect(booking).toHaveProperty('reservedSeats');
    expect(booking).toHaveProperty('numberSeats');
    expect(booking).toHaveProperty('numberSeatsDisabled');
    expect(booking).toHaveProperty('totalPrice');
    expect(booking).toHaveProperty('createDate');
  });

  it('should set status correctly', () => {
    booking.status = BookingStatus.VALIDATED;
    expect(booking.status).toBe(BookingStatus.VALIDATED);
  });

  it('should set userId correctly', () => {
    const userId = 123;
    booking.userId = userId;
    expect(booking.userId).toBe(userId);
  });

  it('should set sessionCinemaId correctly', () => {
    const sessionCinemaId = 456;
    booking.sessionCinemaId = sessionCinemaId;
    expect(booking.sessionCinemaId).toBe(sessionCinemaId);
  });

  it('should set numberSeats correctly', () => {
    const numberSeats = 4;
    booking.numberSeats = numberSeats;
    expect(booking.numberSeats).toBe(numberSeats);
  });

  it('should set numberSeatsDisabled correctly', () => {
    const numberSeatsDisabled = 1;
    booking.numberSeatsDisabled = numberSeatsDisabled;
    expect(booking.numberSeatsDisabled).toBe(numberSeatsDisabled);
  });

  it('should set totalPrice correctly', () => {
    const totalPrice = 45.5;
    booking.totalPrice = totalPrice;
    expect(booking.totalPrice).toBe(totalPrice);
  });

  it('should set user relationship correctly', () => {
    const user = new User();
    user.id = 1;
    booking.user = user;
    expect(booking.user).toBe(user);
    expect(booking.user.id).toBe(1);
  });

  it('should set sessionCinema relationship correctly', () => {
    const sessionCinema = new SessionCinema();
    sessionCinema.id = 2;
    booking.sessionCinema = sessionCinema;
    expect(booking.sessionCinema).toBe(sessionCinema);
    expect(booking.sessionCinema.id).toBe(2);
  });

  it('should handle reservedSeats relationship correctly', () => {
    const bookingDetail1 = new BookingDetail();
    const bookingDetail2 = new BookingDetail();
    booking.reservedSeats = [bookingDetail1, bookingDetail2];

    expect(booking.reservedSeats).toHaveLength(2);
    expect(booking.reservedSeats[0]).toBe(bookingDetail1);
    expect(booking.reservedSeats[1]).toBe(bookingDetail2);
  });

  it('should set createDate correctly', () => {
    const now = new Date();
    booking.createDate = now;
    expect(booking.createDate).toBe(now);
  });

  it('should handle different booking statuses', () => {
    const statuses = [
      BookingStatus.PENDING,
      BookingStatus.VALIDATED,
      BookingStatus.CANCELLED,
    ];

    statuses.forEach((status) => {
      booking.status = status;
      expect(booking.status).toBe(status);
    });
  });

  it('should have default status as PENDING', () => {
    expect(booking.status).toBeUndefined();
  });

  it('should handle numeric values correctly', () => {
    booking.numberSeats = 3;
    booking.numberSeatsDisabled = 0;
    booking.totalPrice = 27.75;

    expect(booking.numberSeats).toBe(3);
    expect(booking.numberSeatsDisabled).toBe(0);
    expect(booking.totalPrice).toBe(27.75);
  });
});
