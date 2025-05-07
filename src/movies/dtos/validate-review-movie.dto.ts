import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class ValidateReviewMovieDto {
  @ApiProperty({
    description: 'Indique si la review est validée ou non',
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  isValidated: boolean;
}
