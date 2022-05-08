import { applyDecorators, Get, Patch, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

import { AdminTokenGuard } from 'library/passport/guard/admin-token.guard';
import { CustomerTokenGuard } from 'library/passport/guard/customer-token.guard';

import { GetMeCustomerResponseDto } from 'src/customer/dto/get-me-customer.dto';

export const CreateCustomer = () =>
  applyDecorators(
    Post('customer/auth'),
    ApiOkResponse({ description: '유저 생성 성공', type: undefined }),
  );

export const LoginCustomer = () =>
  applyDecorators(
    Post('customer/auth/login'),
    ApiOkResponse({ description: '로그인 성공 및 토큰 발급', type: undefined }),
  );

export const GetMeCustomer = () =>
  applyDecorators(
    Get('customer/get-me'),
    ApiOkResponse({
      description: '고객 정보 로드 성공',
      type: GetMeCustomerResponseDto,
    }),
    CustomerTokenGuard(),
  );

export const PatchCustomerForStore = () =>
  applyDecorators(
    Patch('store/:storeId/customer/:customerId'),
    ApiOperation({ summary: '관리자 권한으로 고객 정보를 수정합니다' }),
    ApiOkResponse({ description: '고객 정보 수정 성공', type: undefined }),
    AdminTokenGuard(),
  );
