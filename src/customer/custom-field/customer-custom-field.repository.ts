import { Injectable } from '@nestjs/common';
import { CustomerCustomField } from '@prisma/client';

import { TimeService } from 'library/time/time.service';
import { UuidService } from 'library/uuid/uuid.service';

import { PrismaClientService } from 'library/prisma/type/prisma.type';

@Injectable()
export class CustomerCustomFieldRepository {
  constructor(
    private readonly uuidService: UuidService,
    private readonly timeService: TimeService,
  ) {}

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

  upsertByCustomerIdAndCustomFieldId({
    prismaClientService,
    customer,
    customField,
    content,
  }: {
    prismaClientService: PrismaClientService;
    customer: CustomerCustomField['customer'];
    customField: CustomerCustomField['customField'];

    content: CustomerCustomField['content'];
  }) {
    return prismaClientService.customerCustomField.upsert({
      where: { customer_customField: { customField, customer } },
      update: { content },
      create: {
        createdAt: this.timeService.now(),
        content,
        customer,
        customField,
        id: this.uuidService.generate(),
      },
    });
  }
}
