import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  IsPositive,
  Min,
  Max,
  IsInt,
} from 'class-validator';
import { Languages } from '../../common/enums/languages.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateMovieDto {
  @ApiPropertyOptional({
    description: 'Titre du film',
    example: 'This is my first post',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(250)
  title: string;

  @ApiPropertyOptional({
    description: 'Titre du film en version originale',
    example: 'This is my first post',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(250)
  originalTitle: string;

  @ApiPropertyOptional({
    description: 'Description du film',
    example: 'This is my first post',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Description original du film',
    example: '',
  })
  @IsString()
  @IsOptional()
  originalDescription?: string;

  @ApiPropertyOptional({
    description: 'Tagline',
    example: 'This is my first post',
  })
  @IsString()
  @IsOptional()
  tagline?: string;

  @ApiPropertyOptional({
    description: 'Original Tagline',
    example: 'This is my first post',
  })
  @IsString()
  @IsOptional()
  originalTagline?: string;

  @ApiPropertyOptional({
    description: 'Âge minimum recommandé',
    example: 12,
    minimum: 0,
    maximum: 18,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(18)
  minimumAge?: number;

  @ApiPropertyOptional({
    description: 'Durée du film en minutes',
    example: 120,
    minimum: 1,
    maximum: 600,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Max(600)
  runtime?: number;

  @ApiPropertyOptional({
    description: 'Note moyenne du film',
    example: 7.5,
    minimum: 0,
    maximum: 10,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(10)
  averageRating?: number;

  @ApiPropertyOptional({
    description: 'Film favoris',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isFavorite?: boolean;

  @ApiProperty({
    description: 'ID externe du film (TMDB)',
    example: 12345,
  })
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  movieExterneId: number;

  @ApiPropertyOptional({
    description: 'Note moyenne externe (TMDB)',
    example: 8.2,
    minimum: 0,
    maximum: 10,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(10)
  averageRatingExterne?: number;

  @ApiPropertyOptional({
    description: 'Date de sortie du film',
    example: '2024-03-15T00:00:00Z',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  releaseDate?: Date;

  @ApiPropertyOptional({
    description: 'Film réservé aux adultes',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isAdult?: boolean;

  @ApiProperty({
    description: 'Date de début de diffusion',
    example: '2024-03-15T00:00:00Z',
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiProperty({
    description: 'Date de fin de diffusion',
    example: '2024-04-15T00:00:00Z',
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @ApiProperty({
    enum: Languages,
    description: 'Langue Type',
    example: Languages.FRENCH,
  })
  @IsEnum(Languages)
  @IsNotEmpty()
  originalLanguage: Languages;

  @ApiProperty({
    description: 'Chemin de l\'image de fond',
    example: '/path/to/backdrop.jpg',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  backdropPath: string;

  @ApiProperty({
    description: 'Chemin de l\'affiche du film',
    example: '/path/to/poster.jpg',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  posterPath: string;
}
