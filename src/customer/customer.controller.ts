import { Body, Controller, Res } from '@nestjs/common';

import { Response } from 'express';
import { CookieService } from 'library/cookie/cookie.service';
import { TokenService } from 'library/jwt/token.service';
import { CreateCustomer, LoginCustomer } from 'src/customer/customer.decorator';
import { CustomerService } from 'src/customer/customer.service';

import { CreateCustomerRequestBodyDto } from 'src/customer/dto/create-customer.dto';
import { LoginCustomerRequestBodyDto } from 'src/customer/dto/login-customer.dto';

@Controller('customer')
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
}
