import { Injectable } from '@nestjs/common';
import { CustomerCustomField } from '@prisma/client';

import { PrismaClientService } from 'library/prisma/type/prisma.type';

@Injectable()
export class CustomerCustomFieldRepository {
  createMany({
    prismaClientService,
    record,
  }: {
    prismaClientService: PrismaClientService;
    record: {
      id: CustomerCustomField['id'];
      customer: CustomerCustomField['customer'];
      customField: CustomerCustomField['customField'];
      content: CustomerCustomField['content'];
      createdAt: CustomerCustomField['createdAt'];
    }[];
  }) {
    return prismaClientService.customerCustomField.createMany({ data: record });
  }
}
