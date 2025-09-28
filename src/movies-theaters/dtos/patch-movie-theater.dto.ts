import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsInt, IsOptional, Min } from 'class-validator';
import { CreateMovieTheaterDto } from './create-movie-theater.dto';

export class PatchMovieTheaterDto extends PartialType(CreateMovieTheaterDto) {
  @ApiPropertyOptional()
  @IsInt()
  @Min(1)
  @IsOptional()
  theaterId?: number; // facultatif

  // Explicitly declare all inherited properties to ensure they exist on the instance
  numberSeats?: number;
  numberSeatsDisabled?: number;
  roomNumber?: number;
}
