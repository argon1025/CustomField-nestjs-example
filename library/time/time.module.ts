import { Module } from '@nestjs/common';

import { TimeService } from 'library/time/time.service';

@Module({
  providers: [TimeService],
  exports: [TimeService],
})
export class TimeModule {}
