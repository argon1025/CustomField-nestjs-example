import { Injectable } from '@nestjs/common';
import { Product } from '@prisma/client';

import { PrismaClientService } from 'library/prisma/type/prisma.type';

@Injectable()
export class ProductRepository {
  create({
    prismaClientService,
    id,
    store,
    name,
    price,
  }: {
    prismaClientService: PrismaClientService;
    id: Product['id'];
    store: Product['store'];
    name: Product['name'];
    price: Product['price'];
  }) {
    return prismaClientService.product.create({
      data: { id, store, name, price },
    });
  }

  findManyByIdAndStoreId({
    prismaClientService,
    products,
    store,
  }: {
    prismaClientService: PrismaClientService;
    store: Product['store'];
    products: Product['id'][];
  }) {
    return prismaClientService.product.findMany({
      where: { store, id: { in: products } },
    });
  }
}
