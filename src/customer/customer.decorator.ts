import { applyDecorators, Get, Patch, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AdminTokenGuard } from 'library/passport/guard/admin-token.guard';
import { CustomerTokenGuard } from 'library/passport/guard/customer-token.guard';

import { GetMeCustomerResponseDto } from 'src/customer/dto/get-me-customer.dto';

export const CreateCustomer = () =>
  applyDecorators(
    Post('customer/auth'),
    ApiTags('Customer'),
    ApiOperation({ summary: '고객으로 가입 합니다' }),
    ApiOkResponse({ description: '유저 생성 성공', type: undefined }),
  );

export const LoginCustomer = () =>
  applyDecorators(
    Post('customer/auth/login'),
    ApiTags('Customer'),
    ApiOperation({ summary: '고객으로 로그인합니다' }),
    ApiOkResponse({ description: '로그인 성공 및 토큰 발급', type: undefined }),
  );

export const GetMeCustomer = () =>
  applyDecorators(
    Get('customer/get-me'),
    ApiTags('Customer'),
    ApiOperation({ summary: '로그인한 고객 정보를 로드합니다' }),
    ApiOkResponse({
      description: '고객 정보 로드 성공',
      type: GetMeCustomerResponseDto,
    }),
    CustomerTokenGuard(),
  );

export const PatchCustomerForStore = () =>
  applyDecorators(
    Patch('store/:storeId/customer/:customerId'),
    ApiTags('Store'),
    ApiOperation({ summary: '관리자 권한으로 고객 정보를 수정합니다' }),
    ApiOkResponse({ description: '고객 정보 수정 성공', type: undefined }),
    AdminTokenGuard(),
  );
