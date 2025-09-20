import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class SignInDto {
  @ApiProperty({
    description: 'Adresse email de l\'utilisateur',
    example: 'john.doe@example.com',
    format: 'email'
  })
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;

  @ApiProperty({
    description: 'Mot de passe de l\'utilisateur (minimum 8 caractères)',
    example: 'MonMotDePasse123!',
    minLength: 1,
    maxLength: 255
  })
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  password: string;
}
