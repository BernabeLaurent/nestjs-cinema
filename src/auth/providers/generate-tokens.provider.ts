import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import { User } from 'src/users/user.entity';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
import { RoleUser } from '../../users/enums/roles-users.enum';

@Injectable()
export class GenerateTokensProvider {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  private readonly logger = new Logger(GenerateTokensProvider.name, {
    timestamp: true,
  });

  public async signToken<T>(
    userId: number,
    userRole: RoleUser,
    expiresIn: number,
    payload?: T,
  ) {
    this.logger.log('signToken' + this.jwtConfiguration.audience);

    return await this.jwtService.signAsync(
      {
        sub: userId,
        roleUser: userRole,
        ...payload,
      },
      {
        secret: this.jwtConfiguration.secret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        expiresIn: expiresIn,
      },
    );
  }

  public async generateTokens(user: User) {
    this.logger.log('generateTokens' + JSON.stringify(user));
    const [accessToken, refreshToken] = await Promise.all([
      // Générer le token d'accès
      this.signToken<Partial<ActiveUserData>>(
        user.id,
        user.roleUser,
        this.jwtConfiguration.accessTokenTtl,
        {
          email: user.email,
        },
      ), // Générer le refresh token
      this.signToken(
        user.id,
        user.roleUser,
        this.jwtConfiguration.refreshTokenTtl,
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
