import { IsEnum, IsInt, IsNotEmpty, IsPositive, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TheaterQuality } from '../enums/theaters-qualities.enum';
import { Languages } from '../../common/enums/languages.enum';

export class CreateSessionCinemaDto {
  @ApiPropertyOptional({
    description: 'Date de la séance (sera combinée avec startTime)',
    example: '2025-09-11',
  })
  @IsOptional()
  @IsString()
  date?: string;

  @ApiProperty({
    description: 'Heure de début de la séance ou date/heure complète',
    example: '20:00',
  })
  @IsNotEmpty()
  startTime: string;

  @ApiPropertyOptional({
    description: 'Heure de fin de la séance ou date/heure complète',
    example: '22:00',
  })
  @IsOptional()
  endTime?: string;

  @ApiProperty({
    enum: TheaterQuality,
    description: 'Qualité de diffusion du film',
    example: TheaterQuality.DOLBY_CINEMA,
  })
  @IsEnum(TheaterQuality)
  @IsNotEmpty()
  quality: TheaterQuality;

  @ApiPropertyOptional({
    enum: Languages,
    description: 'Langue du film',
    example: Languages.FRENCH,
    default: Languages.FRENCH,
  })
  @IsEnum(Languages)
  @IsOptional()
  codeLanguage?: Languages;

  @ApiPropertyOptional({
    description: 'ID du cinéma',
    example: 2,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  theaterId?: number;

  @ApiPropertyOptional({
    description: 'Numéro de la salle',
    example: 3,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  roomId?: number;

  @ApiPropertyOptional({
    description: 'ID de la salle de cinéma (sera résolu automatiquement si theaterId et roomId sont fournis)',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  movieTheaterId?: number;

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
