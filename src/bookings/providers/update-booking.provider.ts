import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from '../booking.entity';
import { UpdateBookingDto } from '../dtos/update-booking.dto';

@Injectable()
export class UpdateBookingProvider {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
  ) {}

  public async update(
    id: number,
    updateBookingDto: UpdateBookingDto,
  ): Promise<Booking> {
    try {
      const booking = await this.bookingRepository.findOne({
        where: { id },
        relations: ['user', 'sessionCinema', 'reservedSeats'],
      });

      if (!booking) {
        throw new BadRequestException('Booking not found');
      }

      if (updateBookingDto.status) {
        booking.status = updateBookingDto.status;
      }

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
      throw new BadRequestException('Error updating booking');
    }
  }
}
