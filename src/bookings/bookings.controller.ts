import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { CreateBookingDto } from './dtos/create-booking.dto';
import { BookingsService } from './bookings.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator';
import { AuthType } from '../auth/enums/auth-type.enum';
import { BookingTokenGuard } from '../auth/guards/access-token/booking-token-guard';
import { RoleUser } from 'src/users/enums/roles-users.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @ApiOperation({ summary: 'Create a new booking' })
  @ApiResponse({
    status: 201,
    description: 'The booking has been successfully created.',
  })
  @Post()
  @Auth(AuthType.None)
  @UseInterceptors(ClassSerializerInterceptor)
  public createBooking(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.createBooking(createBookingDto);
  }

  @ApiOperation({ summary: 'Cherche une réservation par son ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Booking found successfully',
  })
  @Get('get/:bookingId')
  @UseInterceptors(ClassSerializerInterceptor)
  @Auth(AuthType.None)
  public getBooking(@Param('bookingId') bookingId: number) {
    return this.bookingsService.getBooking(bookingId);
  }

  @ApiOperation({ summary: 'Retourne toutes les réservations' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Bookings found successfully',
  })
  @Get('get-all')
  @UseInterceptors(ClassSerializerInterceptor)
  @Auth(AuthType.None)
  public getAllBookings() {
    return this.bookingsService.getAllBookings();
  }

  @ApiOperation({ summary: 'Retourne les réservations par son user ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Bookings found successfully',
  })
  @Get('get-by-user/:userId')
  @UseInterceptors(ClassSerializerInterceptor)
  @Auth(AuthType.None)
  public getBookingsByUser(@Param('userId') userId: number) {
    return this.bookingsService.getBookingsByUser(userId);
  }

  @ApiOperation({
    summary: 'Retourne les réservations par son movie theater ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Bookings found successfully',
  })
  @Get('get-by-movie-theather/:movieTheatherId')
  @UseInterceptors(ClassSerializerInterceptor)
  @Auth(AuthType.None)
  public getBookingsByMovieTheather(
    @Param('movieTheatherId') movieTheatherId: number,
  ) {
    return this.bookingsService.getBookingsByMovieTheather(movieTheatherId);
  }

  @ApiOperation({
    summary: 'Retourne les réservations par son session cinema ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Bookings found successfully',
  })
  @Get('get-by-session-cinema/:sessionCinemaId')
  @UseInterceptors(ClassSerializerInterceptor)
  @Auth(AuthType.None)
  public getBookingsBySessionCinema(
    @Param('sessionCinemaId') sessionCinemaId: number,
  ) {
    return this.bookingsService.getBookingsBySessionCinema(sessionCinemaId);
  }

  @ApiOperation({
    summary: 'Retourne les places réservés par son booking ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Bookings details found successfully',
  })
  @Get('get-bookings-details/:bookingId')
  @UseInterceptors(ClassSerializerInterceptor)
  @Auth(AuthType.None)
  public getBookingsDetailsByBooking(@Param('bookingId') bookingId: number) {
    return this.bookingsService.getBookingsDetailsByBooking(bookingId);
  }

  @ApiOperation({
    summary: 'Permet de valider un ticket réservé',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Bookings details reserved',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized, invalid or expired token.',
  })
  @Get('validate-booking-detail')
  @UseInterceptors(ClassSerializerInterceptor)
  @Auth(AuthType.Bearer)
  @Roles([RoleUser.ADMIN])
  @UseGuards(BookingTokenGuard)
  @ApiBearerAuth() // La route attend un Bearer token
  @ApiQuery({
    name: 'token',
    required: true,
    description: 'JWT spécial pour la validation du ticket',
  })
  public validateBookingDetail(
    @Req() req: { bookingPayload?: { bookingDetailId?: number } },
  ) {
    if (
      !req.bookingPayload ||
      typeof req.bookingPayload.bookingDetailId !== 'number'
    ) {
      throw new Error('Invalid booking detail payload');
    }
    const { bookingDetailId } = req.bookingPayload;
    return this.bookingsService.validateBookingDetail(bookingDetailId);
  }
}
