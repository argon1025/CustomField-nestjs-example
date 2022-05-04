import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Store } from '@prisma/client';

import { PrismaService } from 'library/prisma/prisma.service';
import { TimeService } from 'library/time/time.service';
import { UuidService } from 'library/uuid/uuid.service';
import { StoreRepository } from 'src/store/store.repository';

import { CREATE_STORE_FAIL_MESSAGE } from 'src/store/error-message/store.error';

@Injectable()
export class StoreService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly uuidService: UuidService,
    private readonly timeService: TimeService,
    private readonly storeRepository: StoreRepository,
  ) {}

  async createStore({
    name,
    admin,
  }: {
    name: Store['name'];
    admin: Store['admin'];
  }) {
    const uuid = this.uuidService.generate();
    const now = this.timeService.now();
    try {
      return await this.storeRepository.create({
        prismaClientService: this.prismaService,
        id: uuid,
        admin,
        name,
        createdAt: now,
      });
    } catch (error) {
      throw new InternalServerErrorException(CREATE_STORE_FAIL_MESSAGE);
    }
  }
}
