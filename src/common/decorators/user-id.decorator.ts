import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Decorador para obtener solo el userId
export const UserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.user?.userId;
  },
);
