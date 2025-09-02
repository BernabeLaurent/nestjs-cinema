import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class SignInDto {
  @ApiProperty({
    description: 'Email',
    example: 'test@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;

  @ApiProperty({
    description: 'Password',
    example: 'L123456789&121',
  })
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  password: string;
}
