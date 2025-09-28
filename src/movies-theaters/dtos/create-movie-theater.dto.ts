import { IsInt, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMovieTheaterDto {
  @ApiProperty({
    description: 'Nb de siéges disponibles',
    example: '300',
  })
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  numberSeats: number;

  @ApiPropertyOptional({
    description: 'Nb de siéges handicapés disponibles',
    example: '10',
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  numberSeatsDisabled?: number;

  @ApiProperty({
    description: 'Numéro de la salle',
    example: '5',
  })
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  roomNumber: number;

  @ApiProperty({
    description: 'Id du cinéma',
    example: 1,
  })
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  theaterId: number;
}
