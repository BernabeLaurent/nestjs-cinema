import { IsDate, IsEnum, IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TheaterQuality } from '../enums/theaters-qualities.enum';
import { Languages } from '../../common/enums/languages.enum';

export class CreateSessionCinemaDto {
  @ApiProperty({
    description: 'Date et heure du début de la séance',
    example: '2021-01-01T00:00:00Z',
  })
  @IsDate()
  @IsNotEmpty()
  startTime: Date;

  @ApiProperty({
    description: 'Date et heure de fin de la séance',
    example: '2021-01-01T00:00:00Z',
  })
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
    example: Languages.FRANCE,
  })
  @IsEnum(Languages)
  @IsNotEmpty()
  codeLanguage: Languages;

  @ApiProperty({
    description: 'Id de la salle de cinéma',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  movieTheaterId: number;

  @ApiProperty({
    description: 'Id du film',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  movieId: number;
}
