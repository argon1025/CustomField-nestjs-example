import { Injectable } from '@nestjs/common';
import { Store } from '@prisma/client';

import { PrismaClientService } from 'library/prisma/type/prisma.type';

@Injectable()
export class StoreRepository {
  create({
    prismaClientService,
    id,
    name,
    admin,
    createdAt,
  }: {
    prismaClientService: PrismaClientService;
    id: Store['id'];
    name: Store['name'];
    admin: Store['admin'];
    createdAt: Store['createdAt'];
  }) {
    return prismaClientService.store.create({
      data: {
        name,
        id,
        admin,
        createdAt,
      },
    });
  }
}
