import { Body, Controller, Res } from '@nestjs/common';

import { Response } from 'express';
import { CookieService } from 'library/cookie/cookie.service';
import { TokenService } from 'library/jwt/token.service';
import { AdminTokenData } from 'library/passport/decorator/admin-token.decorator';
import { GetMeAdmin, JoinAdmin, LoginAdmin } from 'src/admin/admin.decorator';
import { AdminService } from 'src/admin/admin.service';

import { AdminJwtTokenPayload } from 'library/jwt/type/admin-jwt-token-payload.type';
import { GetMeAdminResponseDto } from 'src/admin/dto/get-me-admin.dto';
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

  @GetMeAdmin()
  async getMeAdmin(@AdminTokenData() { id }: AdminJwtTokenPayload) {
    const adminData = await this.adminService.getMe(id);
    return new GetMeAdminResponseDto({
      email: adminData.email,
      name: adminData.name,
      createdAt: adminData.createdAt,
    });
  }
}
