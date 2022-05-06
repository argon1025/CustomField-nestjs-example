import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { AdminJwtTokenPayload } from 'library/jwt/type/admin-jwt-token-payload.type';
import { CustomerJwtTokenPayload } from 'library/jwt/type/customer-jwt-token-payload.type';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // NOTE: 관리자 토큰
  generateAdminToken(payload: AdminJwtTokenPayload) {
    return this.jwtService.sign(payload);
  }

  // NOTE: 고객 토큰
  generateCustomerToken(payload: CustomerJwtTokenPayload) {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_CUSTOMER_SECRET_KEY'),
      expiresIn: this.configService.get<string>('JWT_CUSTOMER_EXPIRES_IN'),
    });
  }
}
