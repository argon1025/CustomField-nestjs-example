import { applyDecorators, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';

import { AdminTokenGuard } from 'library/passport/guard/admin-token.guard';

export const CreateProduct = () =>
  applyDecorators(
    Post(),
    ApiTags('Product'),
    ApiOperation({ summary: '제품을 생성합니다' }),
    ApiOkResponse({ description: '제품 생성 성공', type: undefined }),
    AdminTokenGuard(),
  );
