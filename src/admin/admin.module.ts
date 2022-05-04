import { Module } from '@nestjs/common';

import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { CookieModule } from 'library/cookie/cookie.module';
import { CryptoModule } from 'library/crypto/crypto.module';
import { TokenModule } from 'library/jwt/token.module';
import { PrismaModule } from 'library/prisma/prisma.module';
import { TimeModule } from 'library/time/time.module';
import { UuidModule } from 'library/uuid/uuid.module';
import { AdminRepository } from 'src/admin/admin.repository';

@Module({
  imports: [
    PrismaModule,
    TimeModule,
    UuidModule,
    CryptoModule,
    CookieModule,
    TokenModule,
  ],
  controllers: [AdminController],
  providers: [AdminService, AdminRepository],
})
export class AdminModule {}
