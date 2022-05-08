import { Injectable } from '@nestjs/common';
import {
  CustomField,
  CustomFieldDefaultData,
  CustomFieldEnumData,
  FieldType,
  Origin,
  Prisma,
} from '@prisma/client';

import { PrismaClientService } from 'library/prisma/type/prisma.type';

@Injectable()
export class CustomFieldRepository {
  create({
    prismaClientService,
    id,
    name,
    store,
    origin,
    require,
    fieldType,
    isArray,
    onlyAdmin,
    createdAt,
  }: {
    prismaClientService: PrismaClientService;
    id: CustomField['id'];
    name: CustomField['name'];
    store: CustomField['store'];
    origin: Origin;
    require: CustomField['require'];
    fieldType: FieldType;
    isArray: CustomField['isArray'];
    onlyAdmin?: CustomField['onlyAdmin'];
    createdAt: CustomField['createdAt'];
  }) {
    return prismaClientService.customField.create({
      data: {
        id,
        name,
        store,
        origin,
        require,
        fieldType,
        isArray,
        onlyAdmin,
        createdAt,
      },
    });
  }

  createEnum({
    prismaClientService,
    id,
    customField,
    enumData,
    createdAt,
  }: {
    prismaClientService: PrismaClientService;
    id: CustomFieldEnumData['id'];
    customField: CustomFieldEnumData['customField'];
    enumData: any[];
    createdAt: CustomFieldEnumData['createdAt'];
  }) {
    const json = enumData as Prisma.JsonArray;
    return prismaClientService.customFieldEnumData.create({
      data: { id, customField, content: json, createdAt },
    });
  }

  createDefault({
    id,
    prismaClientService,
    customField,
    defaultData,
    createdAt,
  }: {
    prismaClientService: PrismaClientService;
    id: CustomFieldDefaultData['id'];
    customField: CustomFieldDefaultData['customField'];
    defaultData: any[];
    createdAt: CustomFieldDefaultData['createdAt'];
  }) {
    const json = defaultData as Prisma.JsonArray;
    return prismaClientService.customFieldDefaultData.create({
      data: {
        id,
        customField,
        content: json,
        createdAt,
      },
    });
  }

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

  findFirstById({
    prismaClientService,
    id,
  }: {
    prismaClientService: PrismaClientService;
    id: CustomField['id'];
  }) {
    return prismaClientService.customField.findFirst({
      where: { id, deletedAt: null },
      include: { isDefault: true, isEnum: true },
    });
  }

  updateById({
    prismaClientService,
    id,
    name,
  }: {
    prismaClientService: PrismaClientService;
    id: CustomField['id'];
    name: CustomField['name'];
  }) {
    return prismaClientService.customField.update({
      where: { id },
      data: { name },
    });
  }

  updateEnumById({
    prismaClientService,
    id,
    enumData,
  }: {
    prismaClientService: PrismaClientService;
    id: CustomFieldEnumData['id'];
    enumData: any[];
  }) {
    const json = enumData as Prisma.JsonArray;
    return prismaClientService.customFieldEnumData.update({
      where: { id },
      data: { content: json },
    });
  }

  updateDefaultById({
    prismaClientService,
    id,
    defaultData,
  }: {
    prismaClientService: PrismaClientService;
    id: CustomFieldDefaultData['id'];
    defaultData: any[];
  }) {
    const json = defaultData as Prisma.JsonArray;
    return prismaClientService.customFieldDefaultData.update({
      where: { id },
      data: { content: json },
    });
  }

  softDeleteById({
    prismaClientService,
    id,
    deletedAt,
  }: {
    prismaClientService: PrismaClientService;
    id: CustomField['id'];
    deletedAt: CustomField['deletedAt'];
  }) {
    return prismaClientService.customField.update({
      where: { id },
      data: { deletedAt },
    });
  }
}
