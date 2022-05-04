import { applyDecorators, Get, Post } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

import { AdminTokenGuard } from 'library/passport/guard/admin-token.guard';

import { GetMeAdminResponseDto } from 'src/admin/dto/get-me-admin.dto';

export const JoinAdmin = () =>
  applyDecorators(
    Post('auth'),
    ApiOkResponse({ description: '관리자 계정을 생성합니다', type: undefined }),
  );

export const LoginAdmin = () =>
  applyDecorators(
    Post('auth/login'),
    ApiOkResponse({
      description: '관리자 로그인 성공 및 토큰 발급',
      type: undefined,
    }),
  );

export const GetMeAdmin = () =>
  applyDecorators(
    Get('get-me'),
    ApiOkResponse({
      description: '어드민 정보 로드 성공',
      type: GetMeAdminResponseDto,
    }),
    AdminTokenGuard(),
  );
