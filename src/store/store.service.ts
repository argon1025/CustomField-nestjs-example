import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Admin, CustomField, FieldType, Origin, Store } from '@prisma/client';

import { PrismaService } from 'library/prisma/prisma.service';
import { TimeService } from 'library/time/time.service';
import { UuidService } from 'library/uuid/uuid.service';
import { CustomFieldRepository } from 'src/store/custom-field/custom-field.repository';
import { CustomFieldService } from 'src/store/custom-field/custom-field.service';
import { StoreRepository } from 'src/store/store.repository';

import {
  CREATE_STORE_FAIL_MESSAGE,
  NOT_FOUND_STORE_MESSAGE,
  YOUR_NOT_ADMIN_THIS_STORE_MESSAGE,
} from 'src/store/error-message/store.error';

@Injectable()
export class StoreService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly uuidService: UuidService,
    private readonly timeService: TimeService,
    private readonly storeRepository: StoreRepository,
    private readonly customFieldService: CustomFieldService,
    private readonly customFieldRepository: CustomFieldRepository,
  ) {}

  async createStore({
    name,
    admin,
  }: {
    name: Store['name'];
    admin: Store['admin'];
  }) {
    const uuid = this.uuidService.generate();
    const now = this.timeService.now();
    try {
      return await this.storeRepository.create({
        prismaClientService: this.prismaService,
        id: uuid,
        admin,
        name,
        createdAt: now,
      });
    } catch (error) {
      throw new InternalServerErrorException(CREATE_STORE_FAIL_MESSAGE);
    }
  }

  // NOTE: 스토어가 존재하는지, 해당 스토어의 오너인지 확인합니다
  async isStoreOwner({
    storeId,
    adminId,
  }: {
    storeId: Store['id'];
    adminId: Admin['id'];
  }) {
    const store = await this.storeRepository.findFirstById({
      prismaClientService: this.prismaService,
      id: storeId,
    });
    if (!store) throw new NotFoundException(NOT_FOUND_STORE_MESSAGE);
    if (store.admin !== adminId)
      throw new BadRequestException(YOUR_NOT_ADMIN_THIS_STORE_MESSAGE);

    return store;
  }

  // NOTE: 스토어가 존재하는지 확인합니다
  async isExist({ storeId }: { storeId: Store['id'] }) {
    const storeResult = await this.storeRepository.findFirstById({
      prismaClientService: this.prismaService,
      id: storeId,
    });
    if (!storeResult) throw new NotFoundException(NOT_FOUND_STORE_MESSAGE);
    return storeResult;
  }

  async createCustomField({
    name,
    origin,
    require,
    fieldType,
    isArray,
    onlyAdmin,
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
    onlyAdmin?: CustomField['onlyAdmin'];
    enumData?: unknown[];
    defaultData?: unknown[];
    storeId: Store['id'];
    adminId: Admin['id'];
  }) {
    // NOTE: 스토어 유효성 검사
    await this.isStoreOwner({ adminId, storeId });

    // NOTE: 커스텀 데이터 유효성 검사
    this.customFieldService.createCustomFieldValidation({
      fieldType,
      isArray,
      enumData,
      defaultData,
    });

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
        onlyAdmin,
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
    await this.isStoreOwner({ adminId, storeId });

    // NOTE: 커스텀필드 정보 로드 및 인가 체크
    const customFieldData = await this.customFieldService.isCustomFieldOwner({
      storeId,
      customFieldId: id,
    });
    this.customFieldService.patchCustomFieldValidation({
      enumData,
      defaultData,
      customFieldData,
    });

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
    const store = await this.isStoreOwner({ adminId, storeId });

    // NOTE: 커스텀필드 정보 로드 및 인가 체크
    await this.customFieldService.isCustomFieldOwner({
      storeId: store.id,
      customFieldId: id,
    });

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
