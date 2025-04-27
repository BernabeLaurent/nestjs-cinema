import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '../../decorators/roles.decorator';
import { User } from '../../../users/user.entity';
import { Request } from 'express';

declare module 'express' {
  interface Request {
    user?: User;
  }
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      Roles,
      context.getHandler(),
    );
    // Si pas de roles définis, on autorise l'accès
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as User;

    if (!user || !user.roleUser) {
      throw new UnauthorizedException();
    }
    // Si l'utilisateur a un des rôles requis, on autorise l'accès
    const hasRole = requiredRoles.includes(user.roleUser);

    if (!hasRole) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
