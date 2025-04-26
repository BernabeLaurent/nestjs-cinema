import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class GetUserDto {
  @ApiPropertyOptional({
    description: 'Get User with his ID',
    example: 1234,
  })
  @IsInt()
  id: number;
}
