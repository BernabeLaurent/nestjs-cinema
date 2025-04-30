import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { CreateSessionCinemaDto } from './create-session-cinema.dto';

export class PatchSessionCinemaDto extends PartialType(CreateSessionCinemaDto) {
  @ApiProperty({
    description: 'Session Cinema ID qui est updatée',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  id: number;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  movieTheaterId?: number; // facultatif

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  movieId?: number; // facultatif
}
