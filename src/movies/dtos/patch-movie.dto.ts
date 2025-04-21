import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';
import { CreateMovieDto } from './create-movie.dto';

export class PatchMovieDto extends PartialType(CreateMovieDto) {
  @ApiProperty({
    description: 'Movie ID qui est updatée',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  id: number;
}
