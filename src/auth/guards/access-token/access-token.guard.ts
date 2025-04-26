import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from 'src/auth/config/jwt.config';
import { Request } from 'express';
import { REQUEST_USER_KEY } from 'src/auth/constants/auth.constants';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService, // Assuming you have a JwtService for JWT token generation
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>, // Assuming you have a JWT configuration for token generation
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Extract the request object from the execution context
    const request: Request = context.switchToHttp().getRequest();
    // Extract the token from the header
    const token = this.extractRequestFromHeader(request);
    // Validate the token using the JWT service
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload: Record<string, any> = await this.jwtService.verifyAsync(
        token,
        this.jwtConfiguration,
      );
      (request as Record<string, any>)[REQUEST_USER_KEY] = payload;
    } catch {
      throw new UnauthorizedException('Invalid token'); // Handle token verification errors
    }

    return true;
  }

  private extractRequestFromHeader(request: Request): string | undefined {
    const [, token] = request.headers.authorization?.split(' ') ?? [];
    return token;
  }
}
