import { applyDecorators, Delete, Get, Patch, Post } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

import { AdminTokenGuard } from 'library/passport/guard/admin-token.guard';

import { GetCustomFieldResponseDto } from 'src/store/custom-field/dto/get-custom-field.dto';
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

export const CreateCustomField = () =>
  applyDecorators(
    Post(':storeId/custom-field'),
    ApiOkResponse({ description: '커스텀 옵션 생성 성공', type: undefined }),
    AdminTokenGuard(),
  );

export const GetCustomField = () =>
  applyDecorators(
    Get(':storeId/custom-field'),
    ApiOkResponse({
      description: '커스텀 옵션 조회 성공',
      type: GetCustomFieldResponseDto,
    }),
  );

export const PatchCustomField = () =>
  applyDecorators(
    Patch(':storeId/custom-field'),
    ApiOkResponse({
      description: '커스텀 옵션 업데이트 성공',
      type: undefined,
    }),
    AdminTokenGuard(),
  );

export const DeleteCustomField = () =>
  applyDecorators(
    Delete(':storeId/custom-field/:customFieldId'),
    ApiOkResponse({
      description: '커스텀 옵션 삭제 성공',
      type: undefined,
    }),
    AdminTokenGuard(),
  );
