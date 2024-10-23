
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const [req] = context.getArgs();
    const userRole = req.user?.work;
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler()) || [];

    const userHasRoles = requiredRoles.find((permission) => userRole === permission);
    if (requiredRoles.length === 0 || userHasRoles) {
      return true;
    }

    throw new ForbiddenException('Insufficient permissions');
  }
}
