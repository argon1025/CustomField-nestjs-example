import { Module } from '@nestjs/common';

import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { CustomFieldValidationModule } from 'library/custom-field-validation/custom-field-validation.module';
import { PrismaModule } from 'library/prisma/prisma.module';
import { TimeModule } from 'library/time/time.module';
import { UuidModule } from 'library/uuid/uuid.module';
import { ProductCustomFieldRepository } from 'src/product/custom-field/product-custom-field.repository';
import { ProductCustomFieldService } from 'src/product/custom-field/product-custom-field.service';
import { ProductRepository } from 'src/product/product.repository';
import { StoreModule } from 'src/store/store.module';

@Module({
  imports: [
    CustomFieldValidationModule,
    PrismaModule,
    UuidModule,
    TimeModule,
    StoreModule,
  ],
  providers: [
    ProductService,
    ProductCustomFieldRepository,
    ProductCustomFieldService,
    ProductRepository,
  ],
  controllers: [ProductController],
  exports: [ProductRepository],
})
export class ProductModule {}
