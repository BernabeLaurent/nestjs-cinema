import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  Param,
  Logger,
} from '@nestjs/common';
import { AuthService } from './providers/auth.service';
import { SignInDto } from './dtos/signing.dto';
import { Auth } from './decorators/auth.decorator';
import { AuthType } from './enums/auth-type.enum';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { PasswordResetProvider } from './providers/password-reset.provider';
import { PasswordResetEmailProvider } from './providers/password-reset-email.provider';
import { ApiOperation, ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

/**
 * Contrôleur responsable de l'authentification des utilisateurs
 * Gère la connexion, la déconnexion et le rafraîchissement des tokens JWT
 */
@ApiTags('Authentification')
@Auth(AuthType.Bearer)
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  /**
   * Constructeur du contrôleur d'authentification
   * @param authService Service d'authentification injecté
   * @param passwordResetProvider Provider pour la réinitialisation de mot de passe
   * @param passwordResetEmailProvider Provider pour l'envoi d'emails de réinitialisation
   */
  constructor(
    private readonly authService: AuthService,
    private readonly passwordResetProvider: PasswordResetProvider,
    private readonly passwordResetEmailProvider: PasswordResetEmailProvider,
  ) {}

  @ApiOperation({
    summary: 'Connexion utilisateur',
    description:
      'Authentifie un utilisateur avec son email et mot de passe et retourne un token JWT',
  })
  @ApiBody({
    type: SignInDto,
    description: 'Informations de connexion (email et mot de passe)',
  })
  @ApiResponse({
    status: 200,
    description: 'Connexion réussie - Retourne les tokens JWT',
    schema: {
      example: {
        data: {
          access_token: 'eyJhbGciOiJIUzI1NiIs...',
          refresh_token: 'eyJhbGciOiJIUzI1NiIs...',
          user: {
            id: '123',
            email: 'user@example.com',
            firstName: 'John',
            lastName: 'Doe',
          },
        },
        apiVersion: '1.0.0',
        timestamp: '2024-03-20T10:30:00Z',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Identifiants invalides',
    schema: {
      example: {
        statusCode: 401,
        message: 'Email ou mot de passe incorrect',
        error: 'Unauthorized',
      },
    },
  })
  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @Auth(AuthType.None)
  public async signIn(@Body() signInDto: SignInDto) {
    this.logger.log('🔐 Sign-in request received:', signInDto.email);
    return this.authService.signIn(signInDto);
  }

  @ApiOperation({
    summary: 'Actualiser les tokens',
    description:
      "Génère de nouveaux tokens JWT à partir d'un refresh token valide",
  })
  @ApiBody({
    type: RefreshTokenDto,
    description: 'Token de rafraîchissement',
  })
  @ApiResponse({
    status: 200,
    description: 'Tokens actualisés avec succès',
    schema: {
      example: {
        data: {
          access_token: 'eyJhbGciOiJIUzI1NiIs...',
          refresh_token: 'eyJhbGciOiJIUzI1NiIs...',
        },
        apiVersion: '1.0.0',
        timestamp: '2024-03-20T10:30:00Z',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Refresh token invalide ou expiré',
  })
  @Post('refresh-tokens')
  @HttpCode(HttpStatus.OK)
  @Auth(AuthType.None)
  public async refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokenDto);
  }

  @ApiOperation({
    summary: 'Demande de réinitialisation de mot de passe',
    description:
      "Envoie un email avec un lien de réinitialisation si l'email existe",
  })
  @ApiBody({
    type: ForgotPasswordDto,
    description: "Email de l'utilisateur",
  })
  @ApiResponse({
    status: 200,
    description: "Email envoyé si l'adresse existe",
    schema: {
      example: {
        data: {
          message:
            'Si cette adresse email existe, un lien de réinitialisation a été envoyé.',
        },
        apiVersion: '1.0.0',
        timestamp: '2024-03-20T10:30:00Z',
      },
    },
  })
  @ApiResponse({
    status: 429,
    description: 'Trop de tentatives de réinitialisation',
  })
  @Post('forgot-password')
  @Throttle({ default: { limit: 3, ttl: 900000 } }) // 3 tentatives par 15 minutes
  @HttpCode(HttpStatus.OK)
  @Auth(AuthType.None)
  public async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<{ message: string }> {
    this.logger.log('🔑 Forgot password request for:', forgotPasswordDto.email);

    const token = await this.passwordResetProvider.createResetToken(
      forgotPasswordDto.email,
    );

    // N'envoyer l'email que si l'utilisateur existe (token !== 'success')
    if (token !== 'success') {
      await this.passwordResetEmailProvider.sendResetEmail(
        forgotPasswordDto.email,
        token,
      );
    }

    // Même réponse dans tous les cas pour éviter l'énumération d'emails
    return {
      message:
        'Si cette adresse email existe, un lien de réinitialisation a été envoyé.',
    };
  }

  @ApiOperation({
    summary: 'Réinitialisation du mot de passe',
    description: 'Utilise le token pour définir un nouveau mot de passe',
  })
  @ApiBody({
    type: ResetPasswordDto,
    description: 'Token et nouveau mot de passe',
  })
  @ApiResponse({
    status: 200,
    description: 'Mot de passe réinitialisé avec succès',
    schema: {
      example: {
        data: {
          message:
            'Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter.',
        },
        apiVersion: '1.0.0',
        timestamp: '2024-03-20T10:30:00Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Token invalide ou expiré',
  })
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @Auth(AuthType.None)
  public async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    this.logger.log('🔒 Password reset attempt with token');

    await this.passwordResetProvider.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.newPassword,
    );

    return {
      message:
        'Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter.',
    };
  }

  @ApiOperation({
    summary: 'Valide un token de réinitialisation',
    description: 'Vérifie si le token est valide et non expiré',
  })
  @ApiResponse({
    status: 200,
    description: 'Statut de validité du token',
    schema: {
      example: {
        data: {
          valid: true,
        },
        apiVersion: '1.0.0',
        timestamp: '2024-03-20T10:30:00Z',
      },
    },
  })
  @Get('validate-reset-token/:token')
  @Auth(AuthType.None)
  public async validateResetToken(
    @Param('token') token: string,
  ): Promise<{ valid: boolean }> {
    const isValid = await this.passwordResetProvider.validateResetToken(token);
    return { valid: isValid };
  }
}
