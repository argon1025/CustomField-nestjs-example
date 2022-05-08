import { applyDecorators, Get, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AdminTokenGuard } from 'library/passport/guard/admin-token.guard';

import { GetMeAdminResponseDto } from 'src/admin/dto/get-me-admin.dto';

export const JoinAdmin = () =>
  applyDecorators(
    Post('auth'),
    ApiTags('Admin'),
    ApiOperation({ summary: '관리자 계정을 생성합니다' }),
    ApiOkResponse({ description: '관리자 계정을 생성 성공', type: undefined }),
  );

export const LoginAdmin = () =>
  applyDecorators(
    Post('auth/login'),
    ApiTags('Admin'),
    ApiOperation({ summary: '관리자 계정으로 로그인합니다' }),
    ApiOkResponse({
      description: '관리자 로그인 성공 및 토큰 발급',
      type: undefined,
    }),
  );

export const GetMeAdmin = () =>
  applyDecorators(
    Get('get-me'),
    ApiTags('Admin'),
    ApiOperation({ summary: '로그인한 관리자 정보를 조회합니다' }),
    ApiOkResponse({
      description: '어드민 정보 로드 성공',
      type: GetMeAdminResponseDto,
    }),
    AdminTokenGuard(),
  );
