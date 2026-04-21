import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../types/jwtPayload.type';

export const CurrentUser = createParamDecorator(
  (property: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const user = request.user as JwtPayload;

    if (!user) {
      return null;
    }

    return property ? user[property] : user;
  },
);
