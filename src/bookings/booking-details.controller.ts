import { Controller, Patch, Param, HttpStatus, Body } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator';
import { AuthType } from '../auth/enums/auth-type.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleUser } from '../users/enums/roles-users.enum';

@Controller('booking-details')
@ApiTags('Booking Details')
@Auth(AuthType.Bearer)
@ApiBearerAuth('access-token')
export class BookingDetailsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @ApiOperation({
    summary: 'Valider un détail de réservation par booking ID et siège',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The booking detail has been successfully validated.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Booking not found.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Access forbidden - requires ADMIN or WORKER role.',
  })
  @Patch(':bookingDetailId/validate')
  @Roles([RoleUser.ADMIN, RoleUser.WORKER])
  public validateBookingDetail(
    @Param('bookingDetailId') bookingDetailId: number,
    @Body() body: { bookingId?: number; seatNumber?: string },
  ) {
    console.log('BookingDetailsController.validateBookingDetail called with:', {
      bookingDetailId,
      body: JSON.stringify(body),
    });

    // Si on reçoit bookingId et seatNumber dans le body, créer un nouveau booking detail
    if (body.bookingId && body.seatNumber) {
      console.log('Using validateBookingBySeat with body data');
      return this.bookingsService.validateBookingBySeat(
        body.bookingId,
        body.seatNumber,
      );
    }

    // Si l'ID est un vrai ID de booking detail (< 1000), utiliser la validation directe
    if (bookingDetailId < 1000) {
      console.log('Using direct validation for real ID:', bookingDetailId);
      return this.bookingsService.validateBookingDetail(bookingDetailId);
    }

    // Sinon, c'est un ID fictif, essayer de le décoder
    console.log('Decoding fictional ID:', bookingDetailId);
    const originalId = bookingDetailId - 1000;
    const bookingId =
      Math.floor(originalId / 100) || Math.floor(originalId / 10) || originalId;
    const seatIndex = originalId % 100;

    const row = String.fromCharCode(65 + Math.floor(seatIndex / 10));
    const seatInRow = (seatIndex % 10) + 1;
    const seatNumber = `${row}${seatInRow}`;

    console.log('Decoded values:', { bookingId, seatNumber });
    return this.bookingsService.validateBookingBySeat(bookingId, seatNumber);
  }
}
