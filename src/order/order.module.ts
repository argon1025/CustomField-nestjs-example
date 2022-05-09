import { Module } from '@nestjs/common';

import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CustomFieldValidationModule } from 'library/custom-field-validation/custom-field-validation.module';
import { PrismaModule } from 'library/prisma/prisma.module';
import { TimeModule } from 'library/time/time.module';
import { UuidModule } from 'library/uuid/uuid.module';
import { CustomerModule } from 'src/customer/customer.module';
import { OrderCustomFieldRepository } from 'src/order/custom-field/order-custom-field.repository';
import { OrderCustomFieldService } from 'src/order/custom-field/order-custom-field.service';
import { OrderRepository } from 'src/order/order.repository';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [
    PrismaModule,
    CustomerModule,
    ProductModule,
    UuidModule,
    TimeModule,
    CustomFieldValidationModule,
  ],
  providers: [
    OrderService,
    OrderCustomFieldRepository,
    OrderCustomFieldService,
    OrderRepository,
  ],
  controllers: [OrderController],
})
export class OrderModule {}
