import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class GetTheaterDto {
  @ApiPropertyOptional({
    description: 'Get Theater with his ID',
    example: 1234,
  })
  @IsInt()
  id: number;
}
