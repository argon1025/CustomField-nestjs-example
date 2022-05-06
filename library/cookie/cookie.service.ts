import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CookieOptions, Response } from 'express';

import { adminTokenCookiePayloadKey } from 'library/cookie/type/admin-token-cookie-payload.type';
import { customerTokenCookiePayloadKey } from 'library/cookie/type/customer-token-cookie-payload.type';

@Injectable()
export class CookieService {
  constructor(private readonly configService: ConfigService) {}

  // NOTE: 어드민 쿠키 설정데이터
  private getAdminTokenCookieOptions(): CookieOptions {
    return {
      httpOnly: this.configService.get<boolean>('ADMIN_COOKIE_HTTP_ONLY', true),
      secure: this.configService.get<boolean>('ADMIN_COOKIE_SECURE', false),
      path: this.configService.get<string>('ADMIN_COOKIE_PATH', '/'),
      domain: this.configService.get<string>(
        'ADMIN_COOKIE_DOMAIN',
        'localhost',
      ),
      maxAge: this.configService.get<number>('ADMIN_COOKIE_MAX_AGE', 1800),
      sameSite: this.configService.get<boolean | 'lax' | 'strict' | 'none'>(
        'ADMIN_COOKIE_SAME_SITE',
        'strict',
      ),
    };
  }

  // NOTE: 고객 쿠키 설정데이터
  private getCustomerTokenCookieOptions(): CookieOptions {
    return {
      httpOnly: this.configService.get<boolean>(
        'CUSTOMER_COOKIE_HTTP_ONLY',
        true,
      ),
      secure: this.configService.get<boolean>('CUSTOMER_COOKIE_SECURE', false),
      path: this.configService.get<string>('CUSTOMER_COOKIE_PATH', '/'),
      domain: this.configService.get<string>(
        'CUSTOMER_COOKIE_DOMAIN',
        'localhost',
      ),
      maxAge: this.configService.get<number>('CUSTOMER_COOKIE_MAX_AGE', 1800),
      sameSite: this.configService.get<boolean | 'lax' | 'strict' | 'none'>(
        'CUSTOMER_COOKIE_SAME_SITE',
        'strict',
      ),
    };
  }

  setAdminTokenCookie({
    response,
    token,
  }: {
    response: Response;
    token: string;
  }) {
    return response.cookie(
      adminTokenCookiePayloadKey,
      token,
      this.getAdminTokenCookieOptions(),
    );
  }

  setCustomerTokenCookie({
    response,
    token,
  }: {
    response: Response;
    token: string;
  }) {
    return response.cookie(
      customerTokenCookiePayloadKey,
      token,
      this.getCustomerTokenCookieOptions(),
    );
  }
}
