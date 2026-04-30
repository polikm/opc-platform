import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * 自定义装饰器：获取当前登录用户
 * 使用方式：@CurrentUser() user: UserPayload
 */
export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    // 如果指定了字段名，则返回该字段的值
    return data ? user?.[data] : user;
  },
);
