import { applyDecorators, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';

import { CustomerTokenGuard } from 'library/passport/guard/customer-token.guard';

export const CreateOrder = () =>
  applyDecorators(
    Post(),
    ApiTags('Order'),
    ApiOperation({ summary: '주문을 생성합니다' }),
    ApiOkResponse({ description: '주문 생성 성공', type: undefined }),
    CustomerTokenGuard(),
  );
