import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsInt, IsNotEmpty } from 'class-validator';

export class PatchUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    description: 'User ID qui est updatée',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  id: number;
}
