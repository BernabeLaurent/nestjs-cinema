import { IsInt, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMovieTheaterDto {
  @ApiProperty({
    description: 'Nb de siéges disponibles',
    example: '300',
  })
  @IsNumber()
  numberSeats: number;

  @ApiPropertyOptional({
    description: 'Nb de siéges handicapés disponibles',
    example: '10',
  })
  @IsNumber()
  @IsOptional()
  numberSeatsDisabled?: number;

  @ApiProperty({
    description: 'Numéro de la salle',
    example: '5',
  })
  @IsNumber()
  @IsNumber()
  @IsNotEmpty()
  roomNumber: number;

  @ApiProperty({
    description: 'Id du cinéma',
    example: 1,
  })
  @IsInt()
  theaterId: number;
}
