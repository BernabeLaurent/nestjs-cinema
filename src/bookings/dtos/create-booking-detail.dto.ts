import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsPositive,
} from 'class-validator';

export class CreateBookingDetailDto {
  @ApiProperty({
    description: 'Numéro du siége réservé',
    example: 1,
  })
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  seatNumber: number;

  @ApiPropertyOptional({
    description: 'True si le siége réservé est validé',
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isValidated?: boolean;
}
