import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({
    description: "Email de l'utilisateur pour la réinitialisation",
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Format email invalide' })
  @IsNotEmpty({ message: 'Email requis' })
  email: string;
}
