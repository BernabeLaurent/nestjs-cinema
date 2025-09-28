import {
  IsBoolean,
  IsNumber,
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsObject,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

class CollectionDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  poster_path: string;

  @IsOptional()
  @IsString()
  backdrop_path: string;
}

class GenreDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;
}

class ProductionCompanyDto {
  @IsNumber()
  id: number;

  @IsOptional()
  @IsString()
  logo_path: string;

  @IsString()
  name: string;

  @IsString()
  origin_country: string;
}

class ProductionCountryDto {
  @IsString()
  iso_3166_1: string;

  @IsString()
  name: string;
}

class SpokenLanguageDto {
  @IsString()
  english_name: string;

  @IsString()
  iso_639_1: string;

  @IsString()
  name: string;
}

export class TmdbMovieDto {
  @IsBoolean()
  adult: boolean;

  @IsOptional()
  @IsString()
  backdrop_path: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => CollectionDto)
  belongs_to_collection: CollectionDto | null;

  @IsNumber()
  budget: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GenreDto)
  genres: GenreDto[];

  @IsOptional()
  @IsString()
  homepage: string;

  @IsNumber()
  id: number;

  @IsOptional()
  @IsString()
  imdb_id: string;

  @IsString()
  original_language: string;

  @IsString()
  original_title: string;

  @IsOptional()
  @IsString()
  overview: string;

  @IsNumber()
  popularity: number;

  @IsOptional()
  @IsString()
  poster_path: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductionCompanyDto)
  production_companies: ProductionCompanyDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductionCountryDto)
  production_countries: ProductionCountryDto[];

  @IsDateString()
  @IsOptional()
  release_date?: string;

  @IsNumber()
  revenue: number;

  @IsOptional()
  @IsNumber()
  runtime: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SpokenLanguageDto)
  spoken_languages: SpokenLanguageDto[];

  @IsString()
  status: string;

  @IsOptional()
  @IsString()
  tagline: string;

  @IsString()
  title: string;

  @IsBoolean()
  video: boolean;

  @IsNumber()
  vote_average: number;

  @IsNumber()
  vote_count: number;
}
