import { Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dtos/create-booking.dto';
import { CreateBookingProvider } from './providers/create-booking.provider';
import { GetBookingProvider } from './providers/get-booking.provider';

@Injectable()
export class BookingsService {
  constructor(
    private readonly createBookingProvider: CreateBookingProvider,
    private readonly getBookingProvider: GetBookingProvider,
  ) {}

  public async createBooking(createBookingDto: CreateBookingDto) {
    return await this.createBookingProvider.create(createBookingDto);
  }

  public async getBooking(id: number) {
    return await this.getBookingProvider.getById(id);
  }

  public async getAllBookings() {
    return await this.getBookingProvider.getAll();
  }

  public async getBookingsByUser(userId: number) {
    return await this.getBookingProvider.getByUser(userId);
  }

  public async getBookingsByMovieTheather(movieTheaterId: number) {
    return await this.getBookingProvider.getByMovieTheather(movieTheaterId);
  }

  public async getBookingsBySessionCinema(sessionCinemaId: number) {
    return await this.getBookingProvider.getBySessionCinema(sessionCinemaId);
  }

  public async getBookingsDetailsByBooking(bookingId: number) {
    return await this.getBookingProvider.getBookingsDetailsByBooking(bookingId);
  }
}
