import { Body, Controller, Param, Res } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { Response } from 'express';
import { CookieService } from 'library/cookie/cookie.service';
import { TokenService } from 'library/jwt/token.service';
import { AdminTokenData } from 'library/passport/decorator/admin-token.decorator';
import { CustomerTokenData } from 'library/passport/decorator/customer-token.decorator';
import {
  CreateCustomer,
  GetMeCustomer,
  LoginCustomer,
  PatchCustomerForStore,
} from 'src/customer/customer.decorator';
import { CustomerService } from 'src/customer/customer.service';

import { AdminJwtTokenPayload } from 'library/jwt/type/admin-jwt-token-payload.type';
import { CustomerJwtTokenPayload } from 'library/jwt/type/customer-jwt-token-payload.type';
import { CreateCustomerRequestBodyDto } from 'src/customer/dto/create-customer.dto';
import { GetMeCustomerResponseDto } from 'src/customer/dto/get-me-customer.dto';
import { LoginCustomerRequestBodyDto } from 'src/customer/dto/login-customer.dto';
import {
  PatchCustomerForStoreRequestBodyDto,
  PatchCustomerForStoreRequestParamDto,
} from 'src/customer/dto/patch-customer-for-store.dto';

@Controller()
export class CustomerController {
  constructor(
    private readonly customerService: CustomerService,
    private readonly tokenService: TokenService,
    private readonly cookieService: CookieService,
  ) {}

  @CreateCustomer()
  async createCustomer(
    @Body()
    { store, name, email, password, customData }: CreateCustomerRequestBodyDto,
  ) {
    await this.customerService.createCustomer({
      store,
      name,
      email,
      password,
      customData,
    });
    return null;
  }

  @LoginCustomer()
  async loginCustomer(
    @Body() { email, password }: LoginCustomerRequestBodyDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.customerService.validateCustomer({
      email,
      password,
    });

    const token = this.tokenService.generateCustomerToken({ id: result.id });
    this.cookieService.setCustomerTokenCookie({ response, token });

    return null;
  }

  @GetMeCustomer()
  async getMeCustomer(
    @CustomerTokenData() customerJwtTokenPayload: CustomerJwtTokenPayload,
  ) {
    const { id, store, name, email, CustomerCustomFields } =
      await this.customerService.getMe({ id: customerJwtTokenPayload.id });

    return new GetMeCustomerResponseDto({
      userId: id,
      storeId: store,
      name,
      email,
      customField: CustomerCustomFields.map((val) => ({
        name: val.CustomField.name,
        customFieldId: val.customField,
        content: val.content as Prisma.JsonArray,
      })),
    });
  }

  @PatchCustomerForStore()
  async patchCustomerForStore(
    @AdminTokenData() { id }: AdminJwtTokenPayload,
    @Param() { storeId, customerId }: PatchCustomerForStoreRequestParamDto,
    @Body()
    { name, customData }: PatchCustomerForStoreRequestBodyDto,
  ) {
    await this.customerService.patchCustomerForStore({
      storeId,
      customerId,
      adminId: id,
      name,
      customData,
    });
    return null;
  }
}
