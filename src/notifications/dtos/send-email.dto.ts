import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
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
    description: 'Nom du template',
    example: 'confirmation_inscription',
  })
  @IsString()
  @IsNotEmpty()
  template: string;

  @ApiProperty({
    description: 'UserId',
    example: '1',
  })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({
    description: 'Pour remplacer des variables dans le template du mail',
    example: {
      name: 'toto',
      age: 25,
      year: 2025,
      info: 'test',
      appName: 'test',
    },
  })
  @IsOptional()
  @IsObject()
  context?: JSON;
}
