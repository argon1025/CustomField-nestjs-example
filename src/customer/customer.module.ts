import { Module } from '@nestjs/common';

import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { CryptoModule } from 'library/crypto/crypto.module';
import { PrismaModule } from 'library/prisma/prisma.module';
import { TimeModule } from 'library/time/time.module';
import { UuidModule } from 'library/uuid/uuid.module';
import { CustomerCustomFieldRepository } from 'src/customer/custom-field/customer-custom-field.repository';
import { CustomerCustomFieldService } from 'src/customer/custom-field/customer-custom-field.service';
import { CustomerRepository } from 'src/customer/customer.repository';
import { StoreModule } from 'src/store/store.module';

@Module({
  imports: [PrismaModule, StoreModule, TimeModule, UuidModule, CryptoModule],
  providers: [
    CustomerService,
    CustomerRepository,
    CustomerCustomFieldRepository,
    CustomerCustomFieldService,
  ],
  controllers: [CustomerController],
})
export class CustomerModule {}
