import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import { User } from 'src/users/user.entity';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
import { RoleUser } from '../../users/enums/roles-users.enum';

@Injectable()
export class GenerateTokensProvider {
  constructor(
    private readonly jwtService: JwtService, // Assuming you have a JwtService for JWT token generation
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>, // Assuming you have a JWT configuration for token generation
  ) {}

  public async signToken<T>(
    userId: number,
    userRole: RoleUser,
    expiresIn: number,
    payload?: T,
  ) {
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
    const [accessToken, refreshToken] = await Promise.all([
      // generate access token
      this.signToken<Partial<ActiveUserData>>(
        user.id,
        user.roleUser,
        this.jwtConfiguration.accessTokenTtl,
        {
          email: user.email,
        },
      ), // generate refresh token
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
