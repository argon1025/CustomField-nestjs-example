import { applyDecorators, Post } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

import { AdminTokenGuard } from 'library/passport/guard/admin-token.guard';

import { CreateStoreResponseDto } from 'src/store/dto/create-store.dto';

export const CreateStore = () =>
  applyDecorators(
    Post(),
    ApiOkResponse({
      description: '스토어 생성 성공',
      type: CreateStoreResponseDto,
    }),
    AdminTokenGuard(),
  );
