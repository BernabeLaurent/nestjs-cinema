import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class GetUserDto {
  @ApiPropertyOptional({
    description: 'Get User with his ID',
    example: 1234,
  })
  @IsInt()
  @Min(1)
  id: number;
}
