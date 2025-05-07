import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dtos/create-booking.dto';
import { UpdateBookingDto } from './dtos/update-booking.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator';
import { AuthType } from '../auth/enums/auth-type.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleUser } from '../users/enums/roles-users.enum';
import { BookingTokenGuard } from 'src/auth/guards/access-token/booking-token-guard';

@Controller('bookings')
@ApiTags('Bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @ApiOperation({ summary: 'Créer une réservation' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The booking has been successfully created.',
  })
  @Post()
  @Auth(AuthType.Bearer)
  public create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(createBookingDto);
  }

  @ApiOperation({ summary: 'Récupérer toutes les réservations' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return all bookings.',
  })
  @Get()
  @Roles([RoleUser.ADMIN])
  public findAll() {
    return this.bookingsService.getAllBookings();
  }

  @ApiOperation({ summary: 'Récupérer une réservation' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return the booking.',
  })
  @Get(':id')
  @Auth(AuthType.Bearer)
  public findOne(@Param('id') id: number) {
    return this.bookingsService.getBooking(id);
  }

  @ApiOperation({ summary: 'Mettre à jour une réservation' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The booking has been successfully updated.',
  })
  @Patch(':id')
  @Auth(AuthType.Bearer)
  public update(
    @Param('id') id: number,
    @Body() updateBookingDto: UpdateBookingDto,
  ) {
    return this.bookingsService.update(id, updateBookingDto);
  }

  @ApiOperation({ summary: 'Supprimer une réservation' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The booking has been successfully deleted.',
  })
  @Delete(':id')
  @Auth(AuthType.Bearer)
  public remove(@Param('id') id: number) {
    return this.bookingsService.remove(+id);
  }

  @ApiOperation({ summary: 'Valider une réservation' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The booking has been successfully validated.',
  })
  @Patch(':id/validate')
  @Roles([RoleUser.ADMIN])
  public validate(@Param('id') id: number) {
    return this.bookingsService.validateBookingDetail(+id);
  }

  @ApiOperation({ summary: 'Annuler une réservation' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The booking has been successfully cancelled.',
  })
  @Patch(':id/cancel')
  @Auth(AuthType.Bearer)
  public cancel(@Param('id') id: number) {
    return this.bookingsService.cancel(+id);
  }

  @ApiOperation({ summary: "Récupérer les réservations d'un utilisateur" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return all bookings for a user.',
  })
  @Get('user/:userId')
  @Auth(AuthType.Bearer)
  public findByUser(@Param('userId') userId: number) {
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
