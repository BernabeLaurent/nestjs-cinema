import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';
import { CreateTheaterDto } from './create-theater.dto';

export class PatchTheaterDto extends PartialType(CreateTheaterDto) {
  @ApiProperty({
    description: 'Theater ID qui est updatée',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  id: number;
}
