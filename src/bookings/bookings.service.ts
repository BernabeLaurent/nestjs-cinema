import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './booking.entity';
import { CreateBookingDto } from './dtos/create-booking.dto';
import { UpdateBookingDto } from './dtos/update-booking.dto';
import { CreateBookingProvider } from './providers/create-booking.provider';
import { UpdateBookingProvider } from './providers/update-booking.provider';
import { ValidateBookingProvider } from './providers/validate-booking.provider';
import { CancelBookingProvider } from './providers/cancel-booking.provider';
import { GetBookingProvider } from './providers/get-booking.provider';
import { ValidateBookingDetailProvider } from './providers/validate-booking-detail.provider';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    private readonly createBookingProvider: CreateBookingProvider,
    private readonly updateBookingProvider: UpdateBookingProvider,
    private readonly validateBookingProvider: ValidateBookingProvider,
    private readonly cancelBookingProvider: CancelBookingProvider,
    private readonly getBookingProvider: GetBookingProvider,
    private readonly validateBookingDetailProvider: ValidateBookingDetailProvider,
  ) {}

  public async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    return this.createBookingProvider.create(createBookingDto);
  }

  public async update(
    id: number,
    updateBookingDto: UpdateBookingDto,
  ): Promise<Booking> {
    return this.updateBookingProvider.update(id, updateBookingDto);
  }

  public async remove(id: number): Promise<void> {
    await this.bookingRepository.delete(id);
  }

  public async validate(id: number): Promise<Booking> {
    return this.validateBookingProvider.validate(id);
  }

  public async cancel(id: number): Promise<Booking> {
    return this.cancelBookingProvider.cancel(id);
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

  public async validateBookingDetail(bookingDetailId: number) {
    return await this.validateBookingDetailProvider.validate(bookingDetailId);
  }
}
