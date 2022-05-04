import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AdminJwtTokenPayload } from 'library/jwt/type/admin-jwt-token-payload.type';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  // NOTE: 관리자 토큰
  generateAdminToken(payload: AdminJwtTokenPayload) {
    return this.jwtService.sign(payload);
  }
}
