import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CustomField, FieldType, Origin, Prisma, Store } from '@prisma/client';

import { PrismaService } from 'library/prisma/prisma.service';
import { CustomFieldValidationService } from 'src/store/custom-field/custom-field-validation.service';
import { CustomFieldRepository } from 'src/store/custom-field/custom-field.repository';

import {
  DEFAULT_DATA_HAVE_ONLY_ONE_ITEM_MESSAGE,
  DEFAULT_DATA_MUST_CONTAINED_ENUM_MESSAGE,
  DEFAULT_DATA_NOT_AVAILABLE_TYPE_MESSAGE,
  NEW_ENUM_MUST_CONTAINED_PREVIOUS_MESSAGE,
  NOT_AVAILABLE_TYPE_ENUM_MESSAGE,
  NOT_FOUND_CUSTOM_FIELD_MESSAGE,
  NOT_OWNER_CUSTOM_FIELD_MESSAGE,
} from 'src/store/custom-field/error-message/create-custom-field.error';
import { CustomFieldInfoItem } from 'src/store/custom-field/type/custom-field-validation.type';

@Injectable()
export class CustomFieldService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly customFieldRepository: CustomFieldRepository,
    private readonly customFieldValidationService: CustomFieldValidationService,
  ) {}

  createCustomFieldValidation({
    fieldType,
    isArray,

    enumData,
    defaultData,
  }: {
    fieldType: FieldType;
    isArray: CustomField['isArray'];
    enumData?: unknown[];
    defaultData?: unknown[];
  }) {
    // NOTE: EnumData 유효성 검사
    if (enumData) {
      // 타입이 정확한지
      if (
        !this.customFieldValidationService.isAvailableDataType(
          fieldType,
          enumData,
        )
      )
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

      if (
        !this.customFieldValidationService.isAvailableDataType(
          fieldType,
          defaultData,
        )
      )
        throw new BadRequestException(DEFAULT_DATA_NOT_AVAILABLE_TYPE_MESSAGE);

      if (enumData) {
        if (
          !this.customFieldValidationService.hasIncludeEnumType(
            enumData,
            defaultData,
          )
        )
          throw new BadRequestException(
            DEFAULT_DATA_MUST_CONTAINED_ENUM_MESSAGE,
          );
      }
    }
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

  async patchCustomFieldValidation({
    enumData,
    defaultData,
    customFieldData,
  }: {
    enumData?: unknown[];
    defaultData?: unknown[];
    customFieldData: CustomFieldInfoItem;
  }) {
    // NOTE: 변경할 Enum 데이터가 존재할 경우
    if (enumData) {
      // 타입 유효성 검사
      if (
        !this.customFieldValidationService.isAvailableDataType(
          customFieldData.fieldType,
          enumData,
        )
      )
        throw new BadRequestException(NOT_AVAILABLE_TYPE_ENUM_MESSAGE);

      // 기존에 정의된 Enum 데이터가 모두 포함되었는가?
      const previousEnumData = customFieldData.isEnum
        .content as Prisma.JsonArray;
      if (
        !this.customFieldValidationService.hasIncludeEnumType(
          enumData,
          previousEnumData,
        )
      )
        throw new BadRequestException(NEW_ENUM_MUST_CONTAINED_PREVIOUS_MESSAGE);
    }

    // NOTE: 변경할 default 데이터가 존재할 경우
    if (defaultData) {
      // 타입 유효성 검사
      if (
        !this.customFieldValidationService.isAvailableDataType(
          customFieldData.fieldType,
          defaultData,
        )
      )
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
        if (
          !this.customFieldValidationService.hasIncludeEnumType(
            enumData,
            defaultData,
          )
        )
          throw new BadRequestException(
            DEFAULT_DATA_MUST_CONTAINED_ENUM_MESSAGE,
          );
      }
    }
  }

  // NOTE: 커스텀필드가 존재하는지, 해당 커스텀필드의 오너인지 확인합니다
  async isCustomFieldOwner({
    storeId,
    customFieldId,
  }: {
    storeId: Store['id'];
    customFieldId: CustomField['id'];
  }) {
    const customFieldData = await this.customFieldRepository.findFirstById({
      prismaClientService: this.prismaService,
      id: customFieldId,
    });
    if (!customFieldData)
      throw new NotFoundException(NOT_FOUND_CUSTOM_FIELD_MESSAGE);
    if (customFieldData.store !== storeId)
      throw new BadRequestException(NOT_OWNER_CUSTOM_FIELD_MESSAGE);

    return customFieldData;
  }
}
