import {
  IsNotEmpty,
  IsNumber,
  ValidateNested,
  IsPositive,
  IsArray,
  ArrayMinSize,
  Min,
  IsInt,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateBookingDetailDto } from './create-booking-detail.dto';
import { Type } from 'class-transformer';

/**
 * DTO pour la création d'une nouvelle réservation
 * Associe un utilisateur à une séance avec la sélection des places
 */
export class CreateBookingDto {
  @ApiProperty({
    description: 'UserId',
    example: 1,
  })
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  userId: number;

  @ApiProperty({
    description: 'SessionCinemaId',
    example: 1,
  })
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  sessionCinemaId: number;

  @ApiProperty({
    description: 'Nb de sièges réservés',
    example: 1,
    minimum: 1,
    maximum: 10,
  })
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  numberSeats: number;

  @ApiProperty({
    description: 'Nb de sièges handicapés réservés',
    example: 0,
    minimum: 0,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  numberSeatsDisabled: number;

  @ApiProperty({
    description: 'Prix total de la réservation',
    example: 10.45,
    minimum: 0.01,
  })
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  totalPrice: number;

  @ApiProperty({
    description: 'Détails des sièges réservés',
    type: () => [CreateBookingDetailDto],
  })
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateBookingDetailDto)
  reservedSeats: CreateBookingDetailDto[];
}
