import { IsString, MinLength, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Token de réinitialisation reçu par email',
    example: 'abc123def456789...',
  })
  @IsString()
  @IsNotEmpty({ message: 'Token requis' })
  token: string;

  @ApiProperty({
    description: 'Nouveau mot de passe (minimum 8 caractères)',
    example: 'NouveauMotDePasse123!',
    minLength: 8,
  })
  @IsString()
  @MinLength(8, { message: 'Mot de passe minimum 8 caractères' })
  @IsNotEmpty({ message: 'Nouveau mot de passe requis' })
  newPassword: string;
}
