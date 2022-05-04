import { Module } from '@nestjs/common';

import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { CryptoModule } from 'library/crypto/crypto.module';
import { PrismaModule } from 'library/prisma/prisma.module';
import { TimeModule } from 'library/time/time.module';
import { UuidModule } from 'library/uuid/uuid.module';
import { AdminRepository } from 'src/admin/admin.repository';

@Module({
  imports: [PrismaModule, TimeModule, UuidModule, CryptoModule],
  controllers: [AdminController],
  providers: [AdminService, AdminRepository],
})
export class AdminModule {}
