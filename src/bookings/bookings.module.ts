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
import { QrCodeService } from './qr-code.service';
import { AuthModule } from '../auth/auth.module';
import { ValidateBookingDetailProvider } from './providers/validate-booking-detail.provider';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from '../auth/config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { UpdateBookingProvider } from './providers/update-booking.provider';
import { CancelBookingProvider } from './providers/cancel-booking.provider';
import { ValidateBookingProvider } from './providers/validate-booking.provider';

@Module({
  providers: [
    BookingsService,
    CreateBookingProvider,
    GetBookingProvider,
    QrCodeService,
    ValidateBookingDetailProvider,
    UpdateBookingProvider,
    CancelBookingProvider,
    ValidateBookingProvider,
  ],
  controllers: [BookingsController],
  exports: [BookingsModule],
  imports: [
    TypeOrmModule.forFeature([Booking, BookingDetail]),
    forwardRef(() => UsersModule),
    forwardRef(() => SessionsCinemasModule),
    forwardRef(() => MoviesTheatersModule),
    forwardRef(() => AuthModule),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
})
export class BookingsModule {}
