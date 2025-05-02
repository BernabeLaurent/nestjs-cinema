import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './booking.entity';
import { BookingDetail } from './booking-detail.entity';

@Module({
  providers: [BookingsService],
  controllers: [BookingsController],
  exports: [BookingsModule],
  imports: [TypeOrmModule.forFeature([Booking, BookingDetail])],
})
export class BookingsModule {}
