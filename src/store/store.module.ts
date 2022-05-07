import { Module } from '@nestjs/common';

import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import { PrismaModule } from 'library/prisma/prisma.module';
import { TimeModule } from 'library/time/time.module';
import { UuidModule } from 'library/uuid/uuid.module';
import { CustomFieldRepository } from 'src/store/custom-field/custom-field.repository';
import { CustomFieldService } from 'src/store/custom-field/custom-field.service';
import { StoreRepository } from 'src/store/store.repository';

@Module({
  imports: [UuidModule, PrismaModule, TimeModule],
  providers: [
    StoreService,
    StoreRepository,
    CustomFieldService,
    CustomFieldRepository,
  ],
  controllers: [StoreController],
  exports: [StoreRepository, CustomFieldRepository, StoreService],
})
export class StoreModule {}
