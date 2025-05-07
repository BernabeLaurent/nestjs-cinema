import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';
import { CreateMovieTheaterDto } from './create-movie-theater.dto';

export class PatchMovieTheaterDto extends PartialType(CreateMovieTheaterDto) {
  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  theaterId?: number; // facultatif
}
