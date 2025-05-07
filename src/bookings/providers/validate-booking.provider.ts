import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from '../booking.entity';
import { BookingStatus } from '../enums/booking-status.enum';

@Injectable()
export class ValidateBookingProvider {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
  ) {}

  public async validate(id: number): Promise<Booking> {
    try {
      const booking = await this.bookingRepository.findOne({
        where: { id },
        relations: ['user', 'sessionCinema', 'reservedSeats'],
      });

      if (!booking) {
        throw new BadRequestException('Booking not found');
      }

      if (booking.status !== BookingStatus.PENDING) {
        throw new BadRequestException('Booking is not in pending status');
      }

      booking.status = BookingStatus.VALIDATED;

      try {
        return await this.bookingRepository.save(booking);
      } catch (error) {
        throw new RequestTimeoutException(error, {
          description: 'pb de base',
        });
      }
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof RequestTimeoutException
      ) {
        throw error;
      }
      throw new BadRequestException('Error validating booking');
    }
  }
}
