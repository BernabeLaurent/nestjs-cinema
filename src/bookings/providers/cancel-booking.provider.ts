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
export class CancelBookingProvider {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
  ) {}

  public async cancel(id: number): Promise<Booking> {
    try {
      const booking = await this.bookingRepository.findOne({
        where: { id },
        relations: ['user', 'sessionCinema', 'reservedSeats'],
      });

      if (!booking) {
        throw new BadRequestException('Booking not found');
      }

      if (booking.status === BookingStatus.CANCELLED) {
        throw new BadRequestException('Booking is already cancelled');
      }

      if (booking.status === BookingStatus.VALIDATED) {
        throw new BadRequestException('Cannot cancel a validated booking');
      }

      booking.status = BookingStatus.CANCELLED;

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
      throw new BadRequestException('Error cancelling booking');
    }
  }
}
