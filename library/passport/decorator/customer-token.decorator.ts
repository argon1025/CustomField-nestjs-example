import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { CustomerJwtTokenPayload } from 'library/jwt/type/customer-jwt-token-payload.type';

export const CustomerTokenData = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): CustomerJwtTokenPayload => {
    const request = ctx.switchToHttp().getRequest();
    // NOTE: passport 검증후에 사용되는 데코레이터로 반드시 CustomerJwtTokenPayload 타입을 반환합니다
    const tokenPayload = request.user as CustomerJwtTokenPayload;

    return tokenPayload;
  },
);
