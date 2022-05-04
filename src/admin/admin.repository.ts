import { Injectable } from '@nestjs/common';
import { Admin } from '@prisma/client';

import { PrismaClientService } from 'library/prisma/type/prisma.type';

@Injectable()
export class AdminRepository {
  create({
    prismaClientService,
    id,
    email,
    name,
    password,
    createdAt,
  }: {
    prismaClientService: PrismaClientService;
    id: Admin['id'];
    email: Admin['email'];
    name: Admin['name'];
    password: Admin['password'];
    createdAt: Admin['createdAt'];
  }) {
    return prismaClientService.admin.create({
      data: { id, email, name, password, createdAt },
    });
  }

  findFirstByEmail({
    prismaClientService,
    email,
  }: {
    prismaClientService: PrismaClientService;
    email: Admin['email'];
  }) {
    return prismaClientService.admin.findFirst({
      where: { email, deletedAt: null },
    });
  }

  findFirstById({
    prismaClientService,
    id,
  }: {
    prismaClientService: PrismaClientService;
    id: Admin['id'];
  }) {
    return prismaClientService.admin.findFirst({
      where: { id, deletedAt: null },
    });
  }
}
