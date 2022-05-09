import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CustomerCustomField,
  CustomField,
  CustomFieldDefaultData,
  CustomFieldEnumData,
} from '@prisma/client';

import { CustomFieldValidationService } from 'library/custom-field-validation/custom-field-validation.service';
import { TimeService } from 'library/time/time.service';
import { UuidService } from 'library/uuid/uuid.service';
import { CustomerCustomFieldRepository } from 'src/customer/custom-field/customer-custom-field.repository';

import {
  NEED_REQUIRE_DATA_MESSAGE,
  NOT_AVAILABLE_ARRAY_MESSAGE,
  NOT_AVAILABLE_TYPE_MESSAGE,
  NOT_AVAILABLE_ENUM_MESSAGE,
} from 'library/custom-field-validation/error-message/custom-filed.error';
import {
  CustomDataItem,
  CustomFieldInfoLists,
} from 'library/custom-field-validation/type/custom-field-validation.type';
import { PrismaClientService } from 'library/prisma/type/prisma.type';
import { CreateCustomerCustomDataItemDto } from 'src/customer/dto/create-customer.dto';

@Injectable()
export class CustomerCustomFieldService {
  constructor(
    private readonly timeService: TimeService,
    private readonly uuidService: UuidService,
    private readonly customFieldValidationService: CustomFieldValidationService,
    private readonly customerCustomFieldRepository: CustomerCustomFieldRepository,
  ) {}

  createCustomerValidation({
    storeCustomField,
    customData,
  }: {
    storeCustomField: CustomFieldInfoLists;
    customData: CustomDataItem[];
  }) {
    // NOTE: 스토어 가입시 요구하는 customData가 있을경우에 진행
    if (storeCustomField.length > 0) {
      // NOTE: 데이터 존재여부 검증
      const hasAllRequireData =
        this.customFieldValidationService.hasAllRequireData({
          storeCustomField,
          customData,
        });
      if (!hasAllRequireData)
        throw new BadRequestException(NEED_REQUIRE_DATA_MESSAGE);

      // NOTE: 배열 소유가능여부 검증
      const hasArrayAvailable =
        this.customFieldValidationService.hasArrayAvailable({
          storeCustomField,
          customData,
        });
      if (!hasArrayAvailable)
        throw new BadRequestException(NOT_AVAILABLE_ARRAY_MESSAGE);

      // NOTE: 타입 검증
      const hasAvailableType =
        this.customFieldValidationService.hasSatisfyConditionType({
          storeCustomField,
          customData,
        });
      if (!hasAvailableType)
        throw new BadRequestException(NOT_AVAILABLE_TYPE_MESSAGE);

      // NOTE: Enum 검증
      const hasAvailableEnumType =
        this.customFieldValidationService.hasAvailableEnumType({
          storeCustomField,
          customData,
        });
      if (!hasAvailableEnumType)
        throw new BadRequestException(NOT_AVAILABLE_ENUM_MESSAGE);
    }
  }

  // NOTE: 레코드 구성
  createCustomerCustomFieldRecords({
    storeCustomField,
    customData,
    customerId,
  }: {
    storeCustomField: (CustomField & {
      isDefault: CustomFieldDefaultData;
      isEnum: CustomFieldEnumData;
    })[];
    customerId: CustomerCustomField['id'];
    customData: CreateCustomerCustomDataItemDto[];
  }): {
    id: CustomerCustomField['id'];
    customer: CustomerCustomField['customer'];
    customField: CustomerCustomField['customField'];
    content: CustomerCustomField['content'];
    createdAt: CustomerCustomField['createdAt'];
  }[] {
    return storeCustomField
      .map((customFieldData) => {
        const now = this.timeService.now();
        const userCustomDataIndex = customData
          ? customData.findIndex(
              (val) => val.customFieldId === customFieldData.id,
            )
          : -1;
        const hasFind = userCustomDataIndex !== -1;
        const contentData = hasFind
          ? customData[userCustomDataIndex].content
          : customFieldData.isDefault?.content;
        const uuid = this.uuidService.generate();

        return {
          id: uuid,
          customer: customerId,
          customField: customFieldData.id,
          content: contentData,
          createdAt: now,
        };
      })
      .filter((item) => !!item.content);
  }

  // NOTE: 업데이트 작업 구성
  PatchCustomerCustomFieldRecords({
    storeCustomField,
    customData,
    customerId,
    prismaClientService,
  }: {
    storeCustomField: (CustomField & {
      isDefault: CustomFieldDefaultData;
      isEnum: CustomFieldEnumData;
    })[];
    customerId: CustomerCustomField['id'];
    customData: CreateCustomerCustomDataItemDto[];
    prismaClientService: PrismaClientService;
  }) {
    return storeCustomField
      .map((customFieldData) => {
        const userCustomDataIndex = customData
          ? customData.findIndex(
              (val) => val.customFieldId === customFieldData.id,
            )
          : -1;
        const hasFind = userCustomDataIndex !== -1;
        const contentData = hasFind
          ? customData[userCustomDataIndex].content
          : customFieldData.isDefault?.content;

        return !contentData
          ? undefined
          : this.customerCustomFieldRepository.upsertByCustomerIdAndCustomFieldId(
              {
                prismaClientService,
                customer: customerId,
                customField: customFieldData.id,
                content: contentData,
              },
            );
      })
      .filter((item) => !!item);
  }
}
