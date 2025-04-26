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

@Injectable()
export class GoogleAuthenticationService implements OnModuleInit {
  private oauthClient: OAuth2Client;

  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersServices: UsersService,
    private readonly generateTokensProvider: GenerateTokensProvider,
  ) {}

  onModuleInit() {
    const clientId = this.jwtConfiguration.googleClientId;
    const clientSecret = this.jwtConfiguration.googleClientSecret;
    this.oauthClient = new OAuth2Client(clientId, clientSecret);
  }

  public async authenticate(googleTokenDto: GoogleTokenDto) {
    let user: User | null;
    // verify the google token send by user
    const loginTicket = await this.oauthClient.verifyIdToken({
      idToken: googleTokenDto.token,
    });

    // Extract the payload from google jwt token
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
    // find the user in the dbb using the googleid
    try {
      user = await this.usersServices.findOneByGoogleId(googleId);
    } catch {
      throw new UnauthorizedException('User not found');
    }
    // if googleid exists generate the token
    if (user) {
      return await this.generateTokensProvider.generateTokens(user);
    }
    // if not create a new user and generate the token
    const newUser = await this.usersServices.createGoogleUser({
      email: email,
      firstName: firstName,
      lastName: lastName,
      googleId: googleId,
    });
    return await this.generateTokensProvider.generateTokens(newUser);
  }
}
