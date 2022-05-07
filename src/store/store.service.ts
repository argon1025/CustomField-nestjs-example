import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Admin, Store } from '@prisma/client';

import { PrismaService } from 'library/prisma/prisma.service';
import { TimeService } from 'library/time/time.service';
import { UuidService } from 'library/uuid/uuid.service';
import { StoreRepository } from 'src/store/store.repository';

import {
  CREATE_STORE_FAIL_MESSAGE,
  NOT_FOUND_STORE_MESSAGE,
  YOUR_NOT_ADMIN_THIS_STORE_MESSAGE,
} from 'src/store/error-message/store.error';

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

  // NOTE: 스토어가 존재하는지, 해당 스토어의 오너인지 확인합니다
  async isStoreOwner({
    storeId,
    adminId,
  }: {
    storeId: Store['id'];
    adminId: Admin['id'];
  }) {
    const store = await this.storeRepository.findFirstById({
      prismaClientService: this.prismaService,
      id: storeId,
    });
    if (!store) throw new NotFoundException(NOT_FOUND_STORE_MESSAGE);
    if (store.admin !== adminId)
      throw new BadRequestException(YOUR_NOT_ADMIN_THIS_STORE_MESSAGE);

    return store;
  }

  // NOTE: 스토어가 존재하는지 확인합니다
  async isExist({ storeId }: { storeId: Store['id'] }) {
    const storeResult = await this.storeRepository.findFirstById({
      prismaClientService: this.prismaService,
      id: storeId,
    });
    if (!storeResult) throw new NotFoundException(NOT_FOUND_STORE_MESSAGE);
    return storeResult;
  }
}
