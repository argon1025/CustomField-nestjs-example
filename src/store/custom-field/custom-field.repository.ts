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
    store,
    origin,
    require,
    fieldType,
    isArray,
    createdAt,
  }: {
    prismaClientService: PrismaClientService;
    id: CustomField['id'];
    store: CustomField['store'];
    origin: Origin;
    require: CustomField['require'];
    fieldType: FieldType;
    isArray: CustomField['isArray'];
    createdAt: CustomField['createdAt'];
  }) {
    return prismaClientService.customField.create({
      data: { id, store, origin, require, fieldType, isArray, createdAt },
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
}
