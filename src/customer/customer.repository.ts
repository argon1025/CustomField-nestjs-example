import { Injectable } from '@nestjs/common';
import { Customer } from '@prisma/client';

import { PrismaClientService } from 'library/prisma/type/prisma.type';

@Injectable()
export class CustomerRepository {
  create({
    prismaClientService,
    id,
    store,
    email,
    name,
    password,
  }: {
    prismaClientService: PrismaClientService;
    id: Customer['id'];
    store: Customer['store'];
    email: Customer['email'];
    name: Customer['name'];
    password: Customer['password'];
  }) {
    return prismaClientService.customer.create({
      data: { id, store, email, name, password },
    });
  }

  findFirstByEmail({
    prismaClientService,
    email,
  }: {
    prismaClientService: PrismaClientService;
    email: Customer['email'];
  }) {
    return prismaClientService.customer.findFirst({ where: { email } });
  }

  findFirstById({
    prismaClientService,
    id,
  }: {
    prismaClientService: PrismaClientService;
    id: Customer['id'];
  }) {
    return prismaClientService.customer.findFirst({
      where: {
        id,
      },
      include: {
        CustomerCustomFields: {
          where: { deletedAt: null, CustomField: { deletedAt: null } },
          include: { CustomField: true },
        },
      },
    });
  }
}
