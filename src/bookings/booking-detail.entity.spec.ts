import { BookingDetail } from './booking-detail.entity';
import { Booking } from './booking.entity';

describe('BookingDetail Entity', () => {
  let bookingDetail: BookingDetail;

  beforeEach(() => {
    bookingDetail = new BookingDetail();
  });

  it('should be defined', () => {
    expect(bookingDetail).toBeDefined();
  });

  it('should have correct properties', () => {
    expect(bookingDetail).toHaveProperty('id');
    expect(bookingDetail).toHaveProperty('seatNumber');
    expect(bookingDetail).toHaveProperty('isValidated');
    expect(bookingDetail).toHaveProperty('booking');
    expect(bookingDetail).toHaveProperty('createDate');
    expect(bookingDetail).toHaveProperty('updateDate');
  });

  it('should set seatNumber correctly', () => {
    const seatNumber = 15;
    bookingDetail.seatNumber = seatNumber;
    expect(bookingDetail.seatNumber).toBe(seatNumber);
  });

  it('should set isValidated correctly', () => {
    bookingDetail.isValidated = true;
    expect(bookingDetail.isValidated).toBe(true);

    bookingDetail.isValidated = false;
    expect(bookingDetail.isValidated).toBe(false);
  });

  it('should set booking relationship correctly', () => {
    const booking = new Booking();
    booking.id = 1;
    bookingDetail.booking = booking;
    expect(bookingDetail.booking).toBe(booking);
    expect(bookingDetail.booking.id).toBe(1);
  });

  it('should set dates correctly', () => {
    const now = new Date();
    bookingDetail.createDate = now;
    bookingDetail.updateDate = now;
    expect(bookingDetail.createDate).toBe(now);
    expect(bookingDetail.updateDate).toBe(now);
  });

  it('should have default value for isValidated as false', () => {
    expect(bookingDetail.isValidated).toBeFalsy();
  });

  it('should handle different seat numbers', () => {
    const seatNumbers = [1, 5, 10, 25, 50, 100];

    seatNumbers.forEach((seatNumber) => {
      bookingDetail.seatNumber = seatNumber;
      expect(bookingDetail.seatNumber).toBe(seatNumber);
    });
  });

  it('should handle validation states', () => {
    expect(bookingDetail.isValidated).toBeFalsy();

    bookingDetail.isValidated = true;
    expect(bookingDetail.isValidated).toBe(true);

    bookingDetail.isValidated = false;
    expect(bookingDetail.isValidated).toBe(false);
  });

  it('should maintain booking relationship integrity', () => {
    const booking = new Booking();
    booking.id = 123;
    booking.totalPrice = 15.5;

    bookingDetail.booking = booking;

    expect(bookingDetail.booking).toBe(booking);
    expect(bookingDetail.booking.id).toBe(123);
    expect(bookingDetail.booking.totalPrice).toBe(15.5);
  });
});
