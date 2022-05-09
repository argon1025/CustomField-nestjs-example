import { Module } from '@nestjs/common';

import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { CookieModule } from 'library/cookie/cookie.module';
import { CryptoModule } from 'library/crypto/crypto.module';
import { CustomFieldValidationModule } from 'library/custom-field-validation/custom-field-validation.module';
import { TokenModule } from 'library/jwt/token.module';
import { CustomerTokenStrategy } from 'library/passport/strategy/customer-token.strategy';
import { PrismaModule } from 'library/prisma/prisma.module';
import { TimeModule } from 'library/time/time.module';
import { UuidModule } from 'library/uuid/uuid.module';
import { CustomerCustomFieldRepository } from 'src/customer/custom-field/customer-custom-field.repository';
import { CustomerCustomFieldService } from 'src/customer/custom-field/customer-custom-field.service';
import { CustomerRepository } from 'src/customer/customer.repository';
import { StoreModule } from 'src/store/store.module';

@Module({
  imports: [
    PrismaModule,
    StoreModule,
    TimeModule,
    UuidModule,
    CryptoModule,
    TokenModule,
    CookieModule,
    CustomFieldValidationModule,
  ],
  providers: [
    CustomerService,
    CustomerRepository,
    CustomerCustomFieldRepository,
    CustomerCustomFieldService,
    CustomerTokenStrategy,
  ],
  controllers: [CustomerController],
  exports: [CustomerRepository],
})
export class CustomerModule {}
