import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, ValidateIf } from 'class-validator';
import { BookingStatus } from '../enums/booking-status.enum';

export class UpdateBookingDto {
  @ApiProperty({
    description: 'Le statut de la réservation',
    enum: BookingStatus,
    required: false,
  })
  @ValidateIf((o, value) => value !== undefined)
  @IsEnum(BookingStatus, {
    message: 'Status must be a valid BookingStatus enum value',
  })
  public status?: BookingStatus;
}
