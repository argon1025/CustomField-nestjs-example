import { Injectable } from '@nestjs/common';
import {
  CustomerCustomField,
  CustomField,
  CustomFieldDefaultData,
  CustomFieldEnumData,
  Prisma,
} from '@prisma/client';

import { TimeService } from 'library/time/time.service';
import { UuidService } from 'library/uuid/uuid.service';

import { CreateCustomerCustomDataItemDto } from 'src/customer/dto/create-customer.dto';

@Injectable()
export class CustomerCustomFieldService {
  constructor(
    private readonly timeService: TimeService,
    private readonly uuidService: UuidService,
  ) {}

  // NOTE: 데이터가 있는지 확인하고 없으면 필수데이터인지 확인한다
  hasAllRequireData({
    storeCustomField,
    customData,
  }: {
    storeCustomField: (CustomField & {
      isDefault: CustomFieldDefaultData;
      isEnum: CustomFieldEnumData;
    })[];
    customData: CreateCustomerCustomDataItemDto[];
  }) {
    return storeCustomField.every((customFieldData) => {
      const userCustomDataIndex = customData
        ? customData.findIndex(
            (val) => val.customFieldID === customFieldData.id,
          )
        : -1;
      const hasFind = userCustomDataIndex !== -1;

      // 유저가 입력한 데이터가 존재하지않고, 필수 데이터일 경우
      if (!hasFind && customFieldData.require) {
        return !!customFieldData.isDefault;
      }

      return true;
    });
  }

  // NOTE: 배열을 사용할 수 있는지 검증한다
  hasArrayAvailable({
    storeCustomField,
    customData,
  }: {
    storeCustomField: (CustomField & {
      isDefault: CustomFieldDefaultData;
      isEnum: CustomFieldEnumData;
    })[];
    customData: CreateCustomerCustomDataItemDto[];
  }) {
    return storeCustomField.every((customFieldData) => {
      const userCustomDataIndex = customData
        ? customData.findIndex(
            (val) => val.customFieldID === customFieldData.id,
          )
        : -1;
      const hasFind = userCustomDataIndex !== -1;

      // 유저 요청 커스텀 데이터 배열 길이가 1 이상일 경우 isArray가 true여야 한다.
      if (hasFind && customData[userCustomDataIndex].content.length > 1) {
        return customFieldData.isArray === true;
      }
      return true;
    });
  }

  // NOTE: 모든 타입이 올바른가
  hasSatisfyConditionType({
    storeCustomField,
    customData,
  }: {
    storeCustomField: (CustomField & {
      isDefault: CustomFieldDefaultData;
      isEnum: CustomFieldEnumData;
    })[];
    customData: CreateCustomerCustomDataItemDto[];
  }) {
    return storeCustomField.every((customFieldData) => {
      const userCustomDataIndex = customData
        ? customData.findIndex(
            (val) => val.customFieldID === customFieldData.id,
          )
        : -1;
      const hasFind = userCustomDataIndex !== -1;

      if (hasFind) {
        return customData[userCustomDataIndex].content.every(
          (val) => typeof val === `${customFieldData.fieldType.toLowerCase()}`,
        );
      }
      return true;
    });
  }

  // NOTE: Enum이 정의되었을 경우 전부 Enum 데이터로 구성되었는가
  hasAvailableEnumType({
    storeCustomField,
    customData,
  }: {
    storeCustomField: (CustomField & {
      isDefault: CustomFieldDefaultData;
      isEnum: CustomFieldEnumData;
    })[];
    customData: CreateCustomerCustomDataItemDto[];
  }) {
    return storeCustomField.every((customFieldData) => {
      if (!customFieldData.isEnum) return true;
      const userCustomDataIndex = customData
        ? customData.findIndex(
            (val) => val.customFieldID === customFieldData.id,
          )
        : -1;
      const hasFind = userCustomDataIndex !== -1;

      if (hasFind) {
        return customData[userCustomDataIndex].content.every((val) => {
          const enumData = customFieldData.isEnum.content as Prisma.JsonArray;
          return enumData.includes(val);
        });
      }
      return true;
    });
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
              (val) => val.customFieldID === customFieldData.id,
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
}
