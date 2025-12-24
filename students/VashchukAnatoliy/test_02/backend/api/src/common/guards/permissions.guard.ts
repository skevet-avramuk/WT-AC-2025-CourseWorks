import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Action } from '../enums/action.enum';
import { RolePolicy } from '../policies/role-policy.map';
import { AuthRequest } from '../types/auth-request.type';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1️⃣ Какие permissions требуются для эндпоинта
    const requiredActions = this.reflector.getAllAndOverride<Action[]>('permissions', [
      context.getHandler(),
      context.getClass(),
    ]);

    // Если ничего не требуется — доступ разрешён
    if (!requiredActions || requiredActions.length === 0) {
      return true;
    }

    // 2️⃣ Кто делает запрос
    const request = context.switchToHttp().getRequest<AuthRequest>();
    const user = request.user;

    if (!user || !user.role) {
      throw new ForbiddenException('Access denied');
    }

    // 3️⃣ Какие permissions есть у роли
    const rolePermissions = RolePolicy[user.role];

    if (!rolePermissions) {
      throw new ForbiddenException('Role has no permissions');
    }

    // 4️⃣ Проверяем: есть ли ВСЕ требуемые permissions
    const hasAllPermissions = requiredActions.every((action) => rolePermissions.includes(action));

    if (!hasAllPermissions) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
