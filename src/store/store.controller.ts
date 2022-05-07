import { Body, Controller, Param, Query } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { AdminTokenData } from 'library/passport/decorator/admin-token.decorator';
import { CustomFieldService } from 'src/store/custom-field/custom-field.service';
import {
  CreateCustomField,
  CreateStore,
  GetCustomField,
  PatchCustomField,
} from 'src/store/store.decorator';
import { StoreService } from 'src/store/store.service';

import { AdminJwtTokenPayload } from 'library/jwt/type/admin-jwt-token-payload.type';
import {
  CreateCustomFieldRequestBodyDto,
  CreateCustomFieldRequestQueryDto,
} from 'src/store/custom-field/dto/create-custom-field.dto';
import {
  GetCustomFieldItem,
  GetCustomFieldRequestParamDto,
  GetCustomFieldRequestQueryDto,
  GetCustomFieldResponseDto,
} from 'src/store/custom-field/dto/get-custom-field.dto';
import {
  PatchCustomFieldRequestBodyDto,
  PatchCustomFieldRequestParamDto,
} from 'src/store/custom-field/dto/patch-custom-field.dto';
import {
  CreateStoreRequestBodyDto,
  CreateStoreResponseDto,
} from 'src/store/dto/create-store.dto';

@Controller('store')
export class StoreController {
  constructor(
    private readonly storeService: StoreService,
    private readonly customFieldService: CustomFieldService,
  ) {}

  @CreateStore()
  async createStore(
    @AdminTokenData() { id }: AdminJwtTokenPayload,
    @Body() { name }: CreateStoreRequestBodyDto,
  ) {
    const storeResult = await this.storeService.createStore({
      admin: id,
      name,
    });

    return new CreateStoreResponseDto({ storeId: storeResult.id });
  }

  @CreateCustomField()
  async createCustomField(
    @AdminTokenData() { id }: AdminJwtTokenPayload,
    @Param() { storeId }: CreateCustomFieldRequestQueryDto,
    @Body() createCustomFieldRequestBodyDto: CreateCustomFieldRequestBodyDto,
  ) {
    await this.customFieldService.createCustomField({
      ...createCustomFieldRequestBodyDto,
      adminId: id,
      storeId,
    });
    return null;
  }

  @GetCustomField()
  async getCustomField(
    @Param() { storeId }: GetCustomFieldRequestParamDto,
    @Query() { origin }: GetCustomFieldRequestQueryDto,
  ) {
    const result = (
      await this.customFieldService.getCustomField({
        storeId,
        origin,
      })
    ).map((val): GetCustomFieldItem => {
      return {
        id: val.id,
        name: val.name,
        origin: val.origin,
        require: val.require,
        fieldType: val.fieldType,
        isArray: val.isArray,
        enumData: val.isEnum
          ? (val.isEnum.content as Prisma.JsonArray)
          : undefined,
        defaultData: val.isDefault
          ? (val.isDefault.content as Prisma.JsonArray)
          : undefined,
      };
    });

    return new GetCustomFieldResponseDto({
      list: result,
    });
  }

  @PatchCustomField()
  async patchCustomField(
    @AdminTokenData() { id }: AdminJwtTokenPayload,
    @Param() { storeId }: PatchCustomFieldRequestParamDto,
    @Body() patchCustomFieldRequestBodyDto: PatchCustomFieldRequestBodyDto,
  ) {
    await this.customFieldService.patchCustomField({
      ...patchCustomFieldRequestBodyDto,
      adminId: id,
      storeId,
    });
    return null;
  }
}
