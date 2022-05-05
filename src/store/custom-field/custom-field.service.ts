import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Admin, CustomField, FieldType, Origin, Store } from '@prisma/client';

import { PrismaService } from 'library/prisma/prisma.service';
import { TimeService } from 'library/time/time.service';
import { UuidService } from 'library/uuid/uuid.service';
import { CustomFieldRepository } from 'src/store/custom-field/custom-field.repository';
import { StoreRepository } from 'src/store/store.repository';

import {
  DEFAULT_DATA_HAVE_ONLY_ONE_ITEM_MESSAGE,
  DEFAULT_DATA_MUST_CONTAINED_ENUM_MESSAGE,
  DEFAULT_DATA_NOT_AVAILABLE_TYPE_MESSAGE,
  NOT_AVAILABLE_TYPE_ENUM_MESSAGE,
} from 'src/store/custom-field/error-message/create-custom-field.error';
import {
  NOT_FOUND_STORE_MESSAGE,
  YOUR_NOT_ADMIN_THIS_STORE_MESSAGE,
} from 'src/store/error-message/store.error';

@Injectable()
export class CustomFieldService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly uuidService: UuidService,
    private readonly timeService: TimeService,
    private readonly storeRepository: StoreRepository,
    private readonly customFieldRepository: CustomFieldRepository,
  ) {}

  async createCustomField({
    origin,
    require,
    fieldType,
    isArray,
    storeId,
    adminId,
    enumData,
    defaultData,
  }: {
    origin: Origin;
    require: CustomField['require'];
    fieldType: FieldType;
    isArray: CustomField['isArray'];
    enumData?: unknown[];
    defaultData?: unknown[];
    storeId: Store['id'];
    adminId: Admin['id'];
  }) {
    // NOTE: 스토어 유효성 검사
    const store = await this.storeRepository.findFirstById({
      prismaClientService: this.prismaService,
      id: storeId,
    });
    if (!store) throw new NotFoundException(NOT_FOUND_STORE_MESSAGE);
    if (store.admin !== adminId)
      throw new BadRequestException(YOUR_NOT_ADMIN_THIS_STORE_MESSAGE);

    // NOTE: EnumData 유효성 검사
    if (enumData) {
      // 타입이 정확한지
      const isAvailableEnumDataType = enumData.every(
        (val) => typeof val === `${fieldType.toLowerCase()}`,
      );
      if (!isAvailableEnumDataType)
        throw new BadRequestException(NOT_AVAILABLE_TYPE_ENUM_MESSAGE);
    }

    // NOTE: DefaultData 유효성 검사
    if (defaultData) {
      if (defaultData.length > 1) {
        if (!isArray)
          throw new BadRequestException(
            DEFAULT_DATA_HAVE_ONLY_ONE_ITEM_MESSAGE,
          );
      }
      const isAvailableDefaultDataType = defaultData.every(
        (val) => typeof val === `${fieldType.toLowerCase()}`,
      );
      if (!isAvailableDefaultDataType)
        throw new BadRequestException(DEFAULT_DATA_NOT_AVAILABLE_TYPE_MESSAGE);
      if (enumData) {
        const hasIncludeEnumData = defaultData.every((val) =>
          enumData.includes(val),
        );
        if (!hasIncludeEnumData)
          throw new BadRequestException(
            DEFAULT_DATA_MUST_CONTAINED_ENUM_MESSAGE,
          );
      }
    }

    // NOTE: 데이터 기록
    await this.prismaService.$transaction(async (prismaConnection) => {
      const now = this.timeService.now();
      const customFieldUuid = this.uuidService.generate();
      const customFieldResult = await this.customFieldRepository.create({
        prismaClientService: prismaConnection,
        id: customFieldUuid,
        store: storeId,
        origin,
        require,
        fieldType,
        isArray,
        createdAt: now,
      });

      if (enumData) {
        const enumUuid = this.uuidService.generate();
        await this.customFieldRepository.createEnum({
          prismaClientService: prismaConnection,
          id: enumUuid,
          customField: customFieldResult.id,
          enumData,
          createdAt: now,
        });
      }

      if (defaultData) {
        const defaultUuid = this.uuidService.generate();
        await this.customFieldRepository.createDefault({
          prismaClientService: prismaConnection,
          id: defaultUuid,
          customField: customFieldResult.id,
          defaultData,
          createdAt: now,
        });
      }
    });
  }

  getCustomField({
    storeId,
    origin,
  }: {
    storeId: Store['id'];
    origin: Origin;
  }) {
    return this.customFieldRepository.findManyByIdAndOrigin({
      prismaClientService: this.prismaService,
      storeId,
      origin,
    });
  }
}
