import { Body, Controller } from '@nestjs/common';

import { AdminTokenData } from 'library/passport/decorator/admin-token.decorator';
import { CreateStore } from 'src/store/store.decorator';
import { StoreService } from 'src/store/store.service';

import { AdminJwtTokenPayload } from 'library/jwt/type/admin-jwt-token-payload.type';
import {
  CreateStoreRequestBodyDto,
  CreateStoreResponseDto,
} from 'src/store/dto/create-store.dto';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

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
}
