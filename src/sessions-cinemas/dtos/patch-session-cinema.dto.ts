import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';
import { CreateSessionCinemaDto } from './create-session-cinema.dto';

export class PatchSessionCinemaDto extends PartialType(CreateSessionCinemaDto) {
  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  movieTheaterId?: number; // facultatif

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  movieId?: number; // facultatif
}
