import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../decorators/roles.decorator';
import { ROLES_KEY } from '../decorators/roles.decorator';

/**
 * 角色守卫
 * 配合 @Roles() 装饰器使用，验证当前用户是否拥有所需角色
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 获取路由所需的角色
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 未设置角色要求，则放行
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    // 用户未认证
    if (!user || !user.role) {
      return false;
    }

    // 检查用户角色是否在所需角色列表中
    return requiredRoles.includes(user.role);
  }
}
