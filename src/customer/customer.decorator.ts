import { applyDecorators, Get, Post } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

import { CustomerTokenGuard } from 'library/passport/guard/customer-token.guard';

import { GetMeCustomerResponseDto } from 'src/customer/dto/get-me-customer.dto';

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

export const GetMeCustomer = () =>
  applyDecorators(
    Get('get-me'),
    ApiOkResponse({
      description: '고객 정보 로드 성공',
      type: GetMeCustomerResponseDto,
    }),
    CustomerTokenGuard(),
  );
