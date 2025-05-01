import { IsNotEmpty, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewMovieDto {
  @ApiProperty({
    description: 'Note',
    example: 8.4,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(0) // Validation minimum 0
  @Max(10) // Validation maximum 10
  note: number;

  @ApiProperty({
    description: 'MovieId',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  movieId: number;

  @ApiProperty({
    description: 'UserId',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  userId: number;
}
