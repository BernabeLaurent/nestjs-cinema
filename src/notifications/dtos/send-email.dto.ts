import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendEmailDto {
  @ApiProperty({
    description: 'Email receveur',
    example: 'toto@test.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @ApiProperty({
    description: 'Subject',
    example: 'Inscription validée ...',
  })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({
    description: 'Texte du mail',
    example: 'Bonjour, votre inscription a été validée ...',
  })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty({
    description: 'UserId',
    example: '1',
  })
  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
