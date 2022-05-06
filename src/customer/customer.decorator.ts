import { applyDecorators, Post } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

export const CreateCustomer = () =>
  applyDecorators(
    Post('auth'),
    ApiOkResponse({ description: '유저 생성 성공', type: undefined }),
  );

export const LoginCustomer = () =>
  applyDecorators(
    Post('auth/login'),
    ApiOkResponse({ description: '로그인 성공 및 토큰 발급', type: undefined }),
  );
