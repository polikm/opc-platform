import { SetMetadata } from '@nestjs/common';

/** 用户角色枚举 */
export enum Role {
  ADMIN = 'admin',
  USER = 'user',
  CREATOR = 'creator',
}

/** 角色元数据键名 */
export const ROLES_KEY = 'roles';

/**
 * 自定义装饰器：标记接口所需的角色
 * 使用方式：@Roles(Role.ADMIN) 或 @Roles(Role.ADMIN, Role.USER)
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
