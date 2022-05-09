import { Injectable } from '@nestjs/common';
import { CustomField, Origin, ProductCustomField } from '@prisma/client';

import { PrismaClientService } from 'library/prisma/type/prisma.type';

@Injectable()
export class ProductCustomFieldRepository {
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
      id: ProductCustomField['id'];
      product: ProductCustomField['product'];
      customField: ProductCustomField['customField'];
      content: ProductCustomField['content'];
      createdAt: ProductCustomField['createdAt'];
    }[];
  }) {
    return prismaClientService.productCustomField.createMany({ data: record });
  }
}
