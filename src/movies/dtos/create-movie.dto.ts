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
} from 'class-validator';
import { Languages } from '../../common/enums/languages.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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

  @IsOptional()
  @IsNumber()
  minimumAge?: number;

  @IsOptional()
  @IsNumber()
  runtime?: number;

  @IsNumber()
  averageRating?: number;

  @IsBoolean()
  isFavorite?: boolean;

  @IsNotEmpty()
  @IsNumber()
  movieExterneId: number;

  @IsNumber()
  averageRatingExterne?: number;

  @IsDate()
  @IsOptional()
  releaseDate?: Date;

  @IsBoolean()
  isAdult?: boolean;

  @IsDate()
  @IsNotEmpty()
  startDate: Date;

  @IsDate()
  @IsNotEmpty()
  endDate: Date;

  @ApiProperty({
    enum: Languages,
    description: 'Langue Type',
    example: Languages.FRENCH,
  })
  @IsEnum(Languages)
  @IsNotEmpty()
  originalLanguage: Languages;

  @IsNotEmpty()
  @IsString()
  backdropPath: string;

  @IsNotEmpty()
  @IsString()
  posterPath: string;
}
