import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CastDto {
  @IsNumber()
  @IsNotEmpty()
  cast_id: number;

  @IsString()
  @IsOptional()
  character?: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  original_name: string;

  @IsString()
  @IsOptional()
  profile_path?: string;

  @IsNumber()
  @IsNotEmpty()
  order: number;

  @IsBoolean()
  @IsNotEmpty()
  adult: boolean;

  @IsNumber()
  @IsNotEmpty()
  gender: number;

  @IsNumber()
  @IsNotEmpty()
  movieId: number;
}
