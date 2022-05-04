import { applyDecorators, Post } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

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
