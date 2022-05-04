import { Module } from '@nestjs/common';

import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import { PrismaModule } from 'library/prisma/prisma.module';
import { TimeModule } from 'library/time/time.module';
import { UuidModule } from 'library/uuid/uuid.module';
import { StoreRepository } from 'src/store/store.repository';

@Module({
  imports: [UuidModule, PrismaModule, TimeModule],
  providers: [StoreService, StoreRepository],
  controllers: [StoreController],
})
export class StoreModule {}
