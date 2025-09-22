import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import jwtConfig from 'src/auth/config/jwt.config';
import { GoogleTokenDto } from '../dtos/google-token.dto';
import { UsersService } from 'src/users/users.service';
import { GenerateTokensProvider } from 'src/auth/providers/generate-tokens.provider';
import { User } from 'src/users/user.entity';
import { RollbarService } from '../../../common/services/rollbar.service';

@Injectable()
export class GoogleAuthenticationService implements OnModuleInit {
  private oauthClient: OAuth2Client;

  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersServices: UsersService,
    private readonly generateTokensProvider: GenerateTokensProvider,
    private readonly rollbarService: RollbarService,
  ) {}

  onModuleInit() {
    const clientId = this.jwtConfiguration.googleClientId;
    const clientSecret = this.jwtConfiguration.googleClientSecret;
    this.oauthClient = new OAuth2Client(clientId, clientSecret);
  }

  public async authenticate(googleTokenDto: GoogleTokenDto) {
    let user: User | null;
    // Vérifier le token Google envoyé par l'utilisateur
    const loginTicket = await this.oauthClient.verifyIdToken({
      idToken: googleTokenDto.token,
    });

    // Extraire le payload du token JWT Google
    const payload = loginTicket.getPayload();
    if (!payload) {
      throw new Error('Invalid token payload');
    }
    const {
      email,
      sub: googleId,
      given_name: firstName,
      family_name: lastName,
    } = payload;

    if (!email || !firstName || !lastName) {
      throw new BadRequestException('Champs manquants');
    }
    // Rechercher l'utilisateur dans la BDD avec le googleId
    try {
      user = await this.usersServices.findOneByGoogleId(googleId);
    } catch {
      throw new UnauthorizedException('User not found');
    }
    // Si googleId existe, générer le token
    if (user) {
      const tokens = await this.generateTokensProvider.generateTokens(user);

      // Track connexion Google réussie pour utilisateur existant
      this.rollbarService.trackUserLogin(user.id, user.email, user.roleUser);

      return tokens;
    }

    // Sinon créer un nouvel utilisateur et générer le token
    const newUser = await this.usersServices.createGoogleUser({
      email: email,
      firstName: firstName,
      lastName: lastName,
      googleId: googleId,
    });

    const tokens = await this.generateTokensProvider.generateTokens(newUser);

    // Track création de compte et connexion Google
    this.rollbarService.trackEvent('user_google_registration', {
      userId: newUser.id,
      email: newUser.email,
      role: newUser.roleUser,
    });

    this.rollbarService.trackUserLogin(
      newUser.id,
      newUser.email,
      newUser.roleUser,
    );

    return tokens;
  }
}
