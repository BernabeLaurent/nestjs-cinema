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
      headers: { authorization?: string };
      bookingPayload?: unknown;
    }>();
    // On récupère le token Bearer dans les en-têtes HTTP
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Token manquant ou invalide');
    }

    // Vérifier que le token commence par "Bearer "
    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Token mal formé');
    }
    
    try {
      req.bookingPayload = this.jwtService.verify(token); // injecte dans la requête
      return true;
    } catch {
      throw new UnauthorizedException('Token expiré ou invalide');
    }
  }
}
