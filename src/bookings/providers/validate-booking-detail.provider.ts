import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookingDetail } from '../booking-detail.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ValidateBookingDetailProvider {
  constructor(
    @InjectRepository(BookingDetail)
    private readonly bookingDetailRepository: Repository<BookingDetail>,
  ) {}

  public async validate(bookingDetailId: number): Promise<boolean> {
    let bookingDetail: BookingDetail | null;
    try {
      bookingDetail = await this.bookingDetailRepository.findOneBy({
        id: bookingDetailId,
      });
    } catch (error) {
      throw new RequestTimeoutException('unable to process your request', {
        description: 'error connecting database' + error,
      });
    }

    if (!bookingDetail) {
      throw new BadRequestException('Bookin detail not found WITH THIS ID');
    }

    if (bookingDetail.isValidated) {
      throw new BadRequestException('Booking detail already validated');
    }

    try {
      // On met à jour le statut de la réservation
      bookingDetail.isValidated = true;
      await this.bookingDetailRepository.save(bookingDetail);
      return true;
    } catch (error) {
      throw new RequestTimeoutException('unable to process your request', {
        description: 'error connecting database' + error,
      });
    }
  }
}
