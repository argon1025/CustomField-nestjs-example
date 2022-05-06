import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';

import { customerTokenCookiePayloadKey } from 'library/cookie/type/customer-token-cookie-payload.type';
import { CustomerJwtTokenPayload } from 'library/jwt/type/customer-jwt-token-payload.type';

@Injectable()
export class CustomerTokenStrategy extends PassportStrategy(
  Strategy,
  'customer-token',
) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => request?.cookies?.[customerTokenCookiePayloadKey],
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_CUSTOMER_SECRET_KEY'),
    });
  }

  async validate(payload: CustomerJwtTokenPayload) {
    return payload;
  }
}
