import { Reflector } from '@nestjs/core';
import { RoleUser } from '../../users/enums/roles-users.enum';

export const Roles = Reflector.createDecorator<RoleUser[]>();
