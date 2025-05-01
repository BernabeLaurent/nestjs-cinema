import { ApiProperty } from '@nestjs/swagger';
import { TheaterQuality } from '../enums/theaters-qualities.enum';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';

export class PriceDto {
  @ApiProperty({
    enum: TheaterQuality,
    description: 'Qualité de diffusion du film',
    example: TheaterQuality.DOLBY_CINEMA,
  })
  @IsEnum(TheaterQuality)
  @IsNotEmpty()
  theaterQuality: TheaterQuality;

  @ApiProperty({
    description: 'Prix de la séance',
    example: 12.5,
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  price: number;
}
