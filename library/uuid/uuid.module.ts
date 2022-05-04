import { Module } from '@nestjs/common';

import { UuidService } from 'library/uuid/uuid.service';

@Module({
  providers: [UuidService],
  exports: [UuidService],
})
export class UuidModule {}
