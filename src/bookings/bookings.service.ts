import { Injectable, Logger } from '@nestjs/common';
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

  private readonly logger = new Logger(BookingsService.name, {
    timestamp: true,
  });

  public async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    this.logger.log('createBooking');
    return this.createBookingProvider.create(createBookingDto);
  }

  public async update(
    id: number,
    updateBookingDto: UpdateBookingDto,
  ): Promise<Booking> {
    this.logger.log('updateBooking');
    return this.updateBookingProvider.update(id, updateBookingDto);
  }

  public async remove(id: number): Promise<void> {
    this.logger.log('removeBooking');
    await this.bookingRepository.delete(id);
  }

  public async validate(id: number): Promise<Booking> {
    this.logger.log('validateBooking');
    return this.validateBookingProvider.validate(id);
  }

  public async cancel(id: number): Promise<Booking> {
    this.logger.log('cancelBooking');
    return this.cancelBookingProvider.cancel(id);
  }

  public async getBooking(id: number) {
    this.logger.log('getBooking');
    return await this.getBookingProvider.getById(id);
  }

  public async getAllBookings() {
    this.logger.log('getAllBookings');
    return await this.getBookingProvider.getAll();
  }

  public async getBookingsByUser(userId: number) {
    this.logger.log('getBookingsByUser');
    return await this.getBookingProvider.getByUser(userId);
  }

  public async getBookingsByMovieTheather(movieTheaterId: number) {
    this.logger.log('getBookingsByMovieTheather');
    return await this.getBookingProvider.getByMovieTheather(movieTheaterId);
  }

  public async getBookingsBySessionCinema(sessionCinemaId: number) {
    this.logger.log('getBookingsBySessionCinema');
    return await this.getBookingProvider.getBySessionCinema(sessionCinemaId);
  }

  public async getBookingsDetailsByBooking(bookingId: number) {
    this.logger.log('getBookingsDetailsByBooking');
    return await this.getBookingProvider.getBookingsDetailsByBooking(bookingId);
  }

  public async validateBookingDetail(bookingDetailId: number) {
    this.logger.log('validateBookingDetail');
    return await this.validateBookingDetailProvider.validate(bookingDetailId);
  }

  public async validateBookingBySeat(bookingId: number, seatNumberOrIndex: string | number) {
    console.log('BookingsService.validateBookingBySeat called with:', { bookingId, seatNumberOrIndex });
    this.logger.log('validateBookingBySeat', { bookingId, seatNumberOrIndex });

    // Récupérer le booking avec ses booking details
    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId },
      relations: ['reservedSeats']
    });

    if (!booking) {
      console.log('ERROR: Booking not found with ID:', bookingId);
      throw new Error(`Booking ${bookingId} not found`);
    }

    console.log('Booking found:', booking);

    // Convertir le numéro de siège en index numérique si nécessaire
    let seatNumber: number;
    if (typeof seatNumberOrIndex === 'string') {
      // Convertir "A1" -> 1, "A2" -> 2, "B1" -> 11, etc.
      const match = seatNumberOrIndex.match(/([A-Z])(\d+)/);
      if (match) {
        const row = match[1].charCodeAt(0) - 65; // A=0, B=1, etc.
        const seat = parseInt(match[2]) - 1; // 1-based vers 0-based
        seatNumber = row * 10 + seat + 1; // Convertir en numéro unique
      } else {
        seatNumber = 1; // Valeur par défaut
      }
    } else {
      seatNumber = seatNumberOrIndex;
    }

    // Chercher le booking detail existant ou le créer
    let bookingDetail = booking.reservedSeats?.find(seat => seat.seatNumber === seatNumber);

    if (!bookingDetail) {
      // Créer un nouveau booking detail si il n'existe pas
      const { BookingDetail } = await import('./booking-detail.entity');
      bookingDetail = new BookingDetail();
      bookingDetail.seatNumber = seatNumber;
      bookingDetail.isValidated = false;
      bookingDetail.booking = booking;

      // Sauvegarder le nouveau booking detail
      const bookingDetailRepository = this.bookingRepository.manager.getRepository(BookingDetail);
      bookingDetail = await bookingDetailRepository.save(bookingDetail);
    }

    // Valider le booking detail
    return await this.validateBookingDetailProvider.validate(bookingDetail.id);
  }
}
