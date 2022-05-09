import { Injectable } from '@nestjs/common';
import { CustomField, OrderCustomField, Origin } from '@prisma/client';

import { PrismaClientService } from 'library/prisma/type/prisma.type';

@Injectable()
export class OrderCustomFieldRepository {
  findManyByIdAndOrigin({
    prismaClientService,
    storeId,
    origin,
  }: {
    prismaClientService: PrismaClientService;
    storeId: CustomField['store'];
    origin: Origin;
  }) {
    return prismaClientService.customField.findMany({
      where: { store: storeId, origin, deletedAt: null },
      include: { isDefault: true, isEnum: true },
    });
  }

  createMany({
    prismaClientService,
    record,
  }: {
    prismaClientService: PrismaClientService;
    record: {
      id: OrderCustomField['id'];
      order: OrderCustomField['order'];
      customField: OrderCustomField['customField'];
      content: OrderCustomField['content'];
      createdAt: OrderCustomField['createdAt'];
    }[];
  }) {
    return prismaClientService.orderCustomField.createMany({ data: record });
  }
}
