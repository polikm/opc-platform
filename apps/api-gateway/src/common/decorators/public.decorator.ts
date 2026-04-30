import { SetMetadata } from '@nestjs/common';

/** 公开路由元数据键名 */
export const IS_PUBLIC_KEY = 'isPublic';

/**
 * 自定义装饰器：标记接口为公开路由（无需JWT认证）
 * 使用方式：@Public()
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
