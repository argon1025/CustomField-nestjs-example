import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  Admin,
  CustomField,
  FieldType,
  Origin,
  Prisma,
  Store,
} from '@prisma/client';

import { PrismaService } from 'library/prisma/prisma.service';
import { TimeService } from 'library/time/time.service';
import { UuidService } from 'library/uuid/uuid.service';
import { CustomFieldRepository } from 'src/store/custom-field/custom-field.repository';
import { StoreRepository } from 'src/store/store.repository';

import {
  DEFAULT_DATA_HAVE_ONLY_ONE_ITEM_MESSAGE,
  DEFAULT_DATA_MUST_CONTAINED_ENUM_MESSAGE,
  DEFAULT_DATA_NOT_AVAILABLE_TYPE_MESSAGE,
  NEW_ENUM_MUST_CONTAINED_PREVIOUS_MESSAGE,
  NOT_AVAILABLE_TYPE_ENUM_MESSAGE,
  NOT_FOUND_CUSTOM_FIELD_MESSAGE,
  NOT_OWNER_CUSTOM_FIELD_MESSAGE,
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

  // NOTE: dataArray의 모든 아이템이 enumArray에 속한 아이템인지 확인합니다.
  private hasIncludeEnumType(enumArray: any[], compareArray: any[]) {
    return compareArray.every((val) => enumArray.includes(val));
  }

  // NOTE: dataArray의 모든아이템 타입이 typeName인지 확인합니다.
  private isAvailableDataType(typeName: string, compareArray: any[]) {
    return compareArray.every(
      (val) => typeof val === `${typeName.toLowerCase()}`,
    );
  }

  async createCustomField({
    name,
    origin,
    require,
    fieldType,
    isArray,
    storeId,
    adminId,
    enumData,
    defaultData,
  }: {
    name: CustomField['name'];
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
        name,
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

  async patchCustomField({
    id,
    adminId,
    storeId,
    name,
    enumData,
    defaultData,
  }: {
    id: CustomField['id'];
    adminId: Admin['id'];
    storeId: Store['id'];
    name?: CustomField['name'];
    enumData?: unknown[];
    defaultData?: unknown[];
  }) {
    // NOTE: 스토어 유효성 검사
    const store = await this.storeRepository.findFirstById({
      prismaClientService: this.prismaService,
      id: storeId,
    });
    if (!store) throw new NotFoundException(NOT_FOUND_STORE_MESSAGE);
    if (store.admin !== adminId)
      throw new BadRequestException(YOUR_NOT_ADMIN_THIS_STORE_MESSAGE);

    // NOTE: 커스텀필드 정보 로드
    const customFieldData = await this.customFieldRepository.findFirstById({
      prismaClientService: this.prismaService,
      id,
    });
    if (!customFieldData) throw new NotFoundException();

    // NOTE: 변경할 Enum 데이터가 존재할 경우
    if (enumData) {
      // 타입 유효성 검사
      if (!this.isAvailableDataType(customFieldData.fieldType, enumData))
        throw new BadRequestException(NOT_AVAILABLE_TYPE_ENUM_MESSAGE);

      // 기존에 정의된 Enum 데이터가 모두 포함되었는가?
      const previousEnumData = customFieldData.isEnum
        .content as Prisma.JsonArray;
      if (!this.hasIncludeEnumType(enumData, previousEnumData))
        throw new BadRequestException(NEW_ENUM_MUST_CONTAINED_PREVIOUS_MESSAGE);
    }

    // NOTE: 변경할 default 데이터가 존재할 경우
    if (defaultData) {
      // 타입 유효성 검사
      if (!this.isAvailableDataType(customFieldData.fieldType, defaultData))
        throw new BadRequestException(DEFAULT_DATA_NOT_AVAILABLE_TYPE_MESSAGE);

      // 배열 가능여부 검사
      if (defaultData.length > 1) {
        if (!customFieldData.isArray)
          throw new BadRequestException(
            DEFAULT_DATA_HAVE_ONLY_ONE_ITEM_MESSAGE,
          );
      }

      // enum 충족여부 검사
      if (enumData) {
        if (!this.hasIncludeEnumType(enumData, defaultData))
          throw new BadRequestException(
            DEFAULT_DATA_MUST_CONTAINED_ENUM_MESSAGE,
          );
      }
    }

    // NOTE: 데이터 업데이트
    await this.prismaService.$transaction(async (prismaConnection) => {
      await this.customFieldRepository.updateById({
        prismaClientService: prismaConnection,
        id,
        name,
      });

      if (enumData) {
        await this.customFieldRepository.updateEnumById({
          prismaClientService: prismaConnection,
          id: customFieldData.isEnum.id,
          enumData,
        });
      }

      if (defaultData) {
        await this.customFieldRepository.updateDefaultById({
          prismaClientService: prismaConnection,
          id: customFieldData.isDefault.id,
          defaultData,
        });
      }
    });
  }

  async softDeleteCustomField({
    id,
    adminId,
    storeId,
  }: {
    id: CustomField['id'];
    adminId: Admin['id'];
    storeId: Store['id'];
  }) {
    // NOTE: 스토어 정보 조회 및 인가 체크
    const store = await this.storeRepository.findFirstById({
      prismaClientService: this.prismaService,
      id: storeId,
    });
    if (!store) throw new NotFoundException(NOT_FOUND_STORE_MESSAGE);
    if (store.admin !== adminId)
      throw new BadRequestException(YOUR_NOT_ADMIN_THIS_STORE_MESSAGE);

    // NOTE: 커스텀필드 정보 로드 및 인가 체크
    const customFieldData = await this.customFieldRepository.findFirstById({
      prismaClientService: this.prismaService,
      id,
    });
    if (!customFieldData)
      throw new NotFoundException(NOT_FOUND_CUSTOM_FIELD_MESSAGE);
    if (customFieldData.store !== store.id)
      throw new BadRequestException(NOT_OWNER_CUSTOM_FIELD_MESSAGE);

    // NOTE: 삭제
    const now = this.timeService.now();
    try {
      await this.customFieldRepository.softDeleteById({
        prismaClientService: this.prismaService,
        id,
        deletedAt: now,
      });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
