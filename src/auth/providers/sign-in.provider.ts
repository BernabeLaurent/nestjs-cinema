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

@Injectable()
export class SignInProvider {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private hashingProvider: HashingProvider, // Provider de hachage pour les mots de passe

    private readonly generateTokensProvider: GenerateTokensProvider,
  ) {}

  public async signIn(signInDto: SignInDto) {
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
      throw new UnauthorizedException('password incorrect');
    }

    return await this.generateTokensProvider.generateTokens(user);
  }
}
