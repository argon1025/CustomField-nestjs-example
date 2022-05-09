import { Injectable } from '@nestjs/common';
import { Order, Product } from '@prisma/client';

import { PrismaClientService } from 'library/prisma/type/prisma.type';

@Injectable()
export class OrderRepository {
  create({
    prismaClientService,
    id,
    customerId,
    store,
    price,
    status,
  }: {
    prismaClientService: PrismaClientService;
    id: Order['id'];
    customerId: Order['customer'];
    store: Order['store'];
    price: Order['price'];
    status: Order['status'];
  }) {
    return prismaClientService.order.create({
      data: { id, customer: customerId, store, price, status },
    });
  }

  connectManyByOrderAndProduct({
    prismaClientService,
    record,
  }: {
    prismaClientService: PrismaClientService;
    record: { order: Order['id']; product: Product['id'] }[];
  }) {
    return prismaClientService.ordersOnProducts.createMany({ data: record });
  }
}
