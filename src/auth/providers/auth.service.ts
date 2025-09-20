import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { SignInDto } from '../dtos/signing.dto';
import { SignInProvider } from './sign-in.provider';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { RefreshTokensProvider } from './refresh-tokens.provider';

/**
 * Service principal d'authentification qui délègue aux providers spécialisés
 * Orchestre les opérations de connexion et de rafraîchissement de tokens
 */
@Injectable()
export class AuthService {
  /**
   * Constructeur du service d'authentification
   * @param usersService Service des utilisateurs pour la validation
   * @param signInProvider Provider de connexion avec validation des credentials
   * @param refreshTokensProvider Provider de rafraîchissement des tokens JWT
   */
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly signInProvider: SignInProvider, // Assuming you have a SignInProvider for password hashing

    private readonly refreshTokensProvider: RefreshTokensProvider,
  ) {}

  /**
   * Authentifie un utilisateur via email/password
   * @param signInDto Données de connexion (email et mot de passe)
   * @returns Tokens JWT (access et refresh) avec les informations utilisateur
   */
  public async signIn(signInDto: SignInDto) {
    return await this.signInProvider.signIn(signInDto);
  }

  /**
   * Génère de nouveaux tokens JWT à partir d'un refresh token
   * @param refreshTokenDto Token de rafraîchissement valide
   * @returns Nouveaux tokens JWT (access et refresh)
   */
  public async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    return await this.refreshTokensProvider.refreshTokens(refreshTokenDto);
  }
}
