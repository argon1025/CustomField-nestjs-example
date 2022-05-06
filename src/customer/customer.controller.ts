import { Body, Controller } from '@nestjs/common';

import { CreateCustomer } from 'src/customer/customer.decorator';
import { CustomerService } from 'src/customer/customer.service';

import { CreateCustomerRequestBodyDto } from 'src/customer/dto/create-customer.dto';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

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
}
