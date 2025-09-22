import {
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDto } from '../dtos/signing.dto';
import { UsersService } from 'src/users/users.service';
import { HashingProvider } from './hashing.provider';
import { GenerateTokensProvider } from './generate-tokens.provider';
import { RollbarService } from '../../common/services/rollbar.service';

@Injectable()
export class SignInProvider {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private hashingProvider: HashingProvider, // Provider de hachage pour les mots de passe
    private readonly generateTokensProvider: GenerateTokensProvider,
    private readonly rollbarService: RollbarService,
  ) {}

  public async signIn(signInDto: SignInDto) {
    try {
      // Rechercher l'utilisateur par email
      // Exception si utilisateur non trouvé
      const user = await this.usersService.findOneByEmail(signInDto.email);

      // Vérifier le mot de passe avec le provider de hachage
      let isEqual: boolean = false;
      if (user.password) {
        try {
          isEqual = await this.hashingProvider.comparePassword(
            signInDto.password,
            user.password || '',
          );
        } catch (error) {
          throw new RequestTimeoutException(error, {
            description: 'pb de base',
          });
        }
      }

      if (!isEqual) {
        // Track tentative de connexion échouée
        this.rollbarService.trackFailedLogin(
          signInDto.email,
          'Mot de passe incorrect',
        );
        throw new UnauthorizedException('password incorrect');
      }

      // Générer les tokens
      const tokens = await this.generateTokensProvider.generateTokens(user);

      // Track connexion réussie
      this.rollbarService.trackUserLogin(user.id, user.email, user.roleUser);

      return tokens;
    } catch (error) {
      // Track tentative de connexion échouée pour utilisateur inexistant
      if (error instanceof Error && error.message?.includes('User not found')) {
        this.rollbarService.trackFailedLogin(
          signInDto.email,
          'Utilisateur inexistant',
        );
      }

      // Re-lancer l'erreur originale
      throw error;
    }
  }
}
