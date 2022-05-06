import { applyDecorators, Post } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

export const CreateCustomer = () =>
  applyDecorators(
    Post('auth'),
    ApiOkResponse({ description: '유저 생성 성공', type: undefined }),
  );
