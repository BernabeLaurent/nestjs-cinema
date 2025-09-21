import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Logger,
} from '@nestjs/common';
import { AuthService } from './providers/auth.service';
import { SignInDto } from './dtos/signing.dto';
import { Auth } from './decorators/auth.decorator';
import { AuthType } from './enums/auth-type.enum';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { ApiOperation, ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger';

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
   */
  constructor(private readonly authService: AuthService) {}

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
}
