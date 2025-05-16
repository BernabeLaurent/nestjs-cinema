import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateMovieFromTmdbDto {
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  original_title: string;

  @IsString()
  overview?: string;

  @IsString()
  tagline?: string;

  @IsBoolean()
  adult: boolean;

  @IsNumber()
  vote_average?: number;

  @IsOptional()
  @IsString()
  release_date?: string;

  @IsNotEmpty()
  @IsString()
  original_language: string;

  @IsNumber()
  runtime: number;

  @IsNotEmpty()
  @IsString()
  backdrop_path: string;

  @IsNotEmpty()
  @IsString()
  poster_path: string;
}
