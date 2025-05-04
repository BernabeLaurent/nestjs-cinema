import { forwardRef, Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './booking.entity';
import { BookingDetail } from './booking-detail.entity';
import { CreateBookingProvider } from './providers/create-booking.provider';
import { GetBookingProvider } from './providers/get-booking.provider';
import { UsersModule } from '../users/users.module';
import { SessionsCinemasModule } from '../sessions-cinemas/sessions-cinemas.module';
import { MoviesTheatersModule } from '../movies-theaters/movies-theaters.module';

@Module({
  providers: [BookingsService, CreateBookingProvider, GetBookingProvider],
  controllers: [BookingsController],
  exports: [BookingsModule],
  imports: [
    TypeOrmModule.forFeature([Booking, BookingDetail]),
    forwardRef(() => UsersModule),
    forwardRef(() => SessionsCinemasModule),
    forwardRef(() => MoviesTheatersModule),
  ],
})
export class BookingsModule {}
