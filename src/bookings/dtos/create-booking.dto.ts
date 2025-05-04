import { IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateBookingDetailDto } from './create-booking-detail.dto';
import { Type } from 'class-transformer';

export class CreateBookingDto {
  @ApiProperty({
    description: 'UserId',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @ApiProperty({
    description: 'SessionCinemaId',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  sessionCinemaId: number;

  @ApiProperty({
    description: 'Nb de siéges réservés',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  numberSeats: number;

  @ApiProperty({
    description: 'Nb de siéges handicapés réservés',
    example: 0,
  })
  @IsNotEmpty()
  @IsNumber()
  numberSeatsDisabled: number;

  @ApiProperty({
    description: 'Prix total de la réservation',
    example: 10.45,
  })
  @IsNotEmpty()
  @IsNumber()
  totalPrice: number;

  @ApiProperty({
    description: 'Détails des sièges réservés',
    type: () => [CreateBookingDetailDto],
  })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateBookingDetailDto)
  reservedSeats: CreateBookingDetailDto[];
}
