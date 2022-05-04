import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';

import { adminTokenCookiePayloadKey } from 'library/cookie/type/admin-token-cookie-payload.type';
import { AdminJwtTokenPayload } from 'library/jwt/type/admin-jwt-token-payload.type';

@Injectable()
export class AdminTokenStrategy extends PassportStrategy(
  Strategy,
  'admin-token',
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => request?.cookies[adminTokenCookiePayloadKey],
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ADMIN_SECRET_KEY'),
    });
  }

  async validate(payload: AdminJwtTokenPayload) {
    return payload;
  }
}
