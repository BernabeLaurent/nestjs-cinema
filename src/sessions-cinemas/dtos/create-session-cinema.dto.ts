import { IsDate, IsEnum, IsInt, IsNotEmpty, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TheaterQuality } from '../enums/theaters-qualities.enum';
import { Languages } from '../../common/enums/languages.enum';
import { Type } from 'class-transformer';

export class CreateSessionCinemaDto {
  @ApiProperty({
    description: 'Date et heure du début de la séance',
    example: '2024-03-15T20:30:00Z',
  })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  startTime: Date;

  @ApiProperty({
    description: 'Date et heure de fin de la séance',
    example: '2024-03-15T22:30:00Z',
  })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  endTime: Date;

  @ApiProperty({
    enum: TheaterQuality,
    description: 'Qualité de diffusion du film',
    example: TheaterQuality.DOLBY_CINEMA,
  })
  @IsEnum(TheaterQuality)
  @IsNotEmpty()
  quality: TheaterQuality;

  @ApiProperty({
    enum: Languages,
    description: 'Langue du film',
    example: Languages.FRENCH,
  })
  @IsEnum(Languages)
  @IsNotEmpty()
  codeLanguage: Languages;

  @ApiProperty({
    description: 'ID de la salle de cinéma',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  movieTheaterId: number;

  @ApiProperty({
    description: 'ID du film',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  movieId: number;
}
