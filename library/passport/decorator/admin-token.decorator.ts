import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { AdminJwtTokenPayload } from 'library/jwt/type/admin-jwt-token-payload.type';

export const JwtRefreshTokenData = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): AdminJwtTokenPayload => {
    const request = ctx.switchToHttp().getRequest();
    // NOTE: passport 검증후에 사용되는 데코레이터로 반드시 AdminJwtTokenPayload 타입을 반환합니다
    const tokenPayload = request.user as AdminJwtTokenPayload;

    return tokenPayload;
  },
);
