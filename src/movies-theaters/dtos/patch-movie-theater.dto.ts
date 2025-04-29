import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';
import { CreateMovieTheaterDto } from './create-movie-theater.dto';

export class PatchMovieTheaterDto extends PartialType(CreateMovieTheaterDto) {
  @ApiProperty({
    description: 'Movie Theater ID qui est updatée',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  id: number;
}
