import { Body, Controller, Param } from '@nestjs/common';

import { AdminTokenData } from 'library/passport/decorator/admin-token.decorator';
import { CustomFieldService } from 'src/store/custom-field/custom-field.service';
import { CreateCustomField, CreateStore } from 'src/store/store.decorator';
import { StoreService } from 'src/store/store.service';

import { AdminJwtTokenPayload } from 'library/jwt/type/admin-jwt-token-payload.type';
import {
  CreateCustomFieldRequestBodyDto,
  CreateCustomFieldRequestQueryDto,
} from 'src/store/custom-field/dto/create-custom-field.dto';
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
}
