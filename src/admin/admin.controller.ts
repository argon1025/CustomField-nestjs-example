import { Body, Controller, Res } from '@nestjs/common';

import { Response } from 'express';
import { CookieService } from 'library/cookie/cookie.service';
import { TokenService } from 'library/jwt/token.service';
import { JoinAdmin, LoginAdmin } from 'src/admin/admin.decorator';
import { AdminService } from 'src/admin/admin.service';

import { JoinAdminRequestBodyDto } from 'src/admin/dto/join-admin.dto';
import { LoginAdminRequestBodyDto } from 'src/admin/dto/login-admin.dto';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly tokenService: TokenService,
    private readonly cookieService: CookieService,
  ) {}

  @JoinAdmin()
  async joinAdmin(@Body() joinAdminRequestBodyDto: JoinAdminRequestBodyDto) {
    await this.adminService.join(joinAdminRequestBodyDto);
    return null;
  }

  @LoginAdmin()
  async loginAdmin(
    @Body() loginAdminRequestBodyDto: LoginAdminRequestBodyDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.adminService.validateAdmin(
      loginAdminRequestBodyDto,
    );

    const token = this.tokenService.generateAdminToken({ id: result.id });
    // NOTE: AdminTokenCookiePayload 인터페이스 준수
    this.cookieService.setAdminTokenCookie({ response, token });

    return null;
  }
}
