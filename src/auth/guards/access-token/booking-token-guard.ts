import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class BookingTokenGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<{
      query: { token?: string };
      bookingPayload?: unknown;
    }>();

    // On récupère le token depuis le query string
    const token = req.query.token;

    if (!token) {
      throw new UnauthorizedException('Token manquant ou invalide');
    }

    try {
      req.bookingPayload = this.jwtService.verify(token); // injecte dans la requête
      return true;
    } catch {
      throw new UnauthorizedException('Token expiré ou invalide');
    }
  }
}
