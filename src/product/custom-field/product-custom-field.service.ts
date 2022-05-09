import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CustomField,
  CustomFieldDefaultData,
  CustomFieldEnumData,
  ProductCustomField,
} from '@prisma/client';

import { CustomFieldValidationService } from 'library/custom-field-validation/custom-field-validation.service';
import { TimeService } from 'library/time/time.service';
import { UuidService } from 'library/uuid/uuid.service';

import {
  NEED_REQUIRE_DATA_MESSAGE,
  NOT_AVAILABLE_ARRAY_MESSAGE,
  NOT_AVAILABLE_ENUM_MESSAGE,
  NOT_AVAILABLE_TYPE_MESSAGE,
} from 'library/custom-field-validation/error-message/custom-filed.error';
import {
  CustomDataItem,
  CustomFieldInfoLists,
} from 'library/custom-field-validation/type/custom-field-validation.type';

@Injectable()
export class ProductCustomFieldService {
  constructor(
    private readonly timeService: TimeService,
    private readonly uuidService: UuidService,
    private readonly customFieldValidationService: CustomFieldValidationService,
  ) {}

  createProductValidation({
    storeCustomField,
    customData,
  }: {
    storeCustomField: CustomFieldInfoLists;
    customData: CustomDataItem[];
  }) {
    // NOTE: 물건 생성시 요구하는 커스텀필드가 있는경우에만 진행
    if (storeCustomField.length > 0) {
      // NOTE: 필수 데이터가 모두 존재하는가
      const hasAllRequireData =
        this.customFieldValidationService.hasAllRequireData({
          storeCustomField,
          customData,
        });
      if (!hasAllRequireData)
        throw new BadRequestException(NEED_REQUIRE_DATA_MESSAGE);

      // NOTE: 여러 아이템을 가질 수 있는 커스텀 옵션인가
      const hasArrayAvailable =
        this.customFieldValidationService.hasArrayAvailable({
          storeCustomField,
          customData,
        });
      if (!hasArrayAvailable)
        throw new BadRequestException(NOT_AVAILABLE_ARRAY_MESSAGE);

      // NOTE: 모든 타입이 일치하는가
      const hasAvailableType =
        this.customFieldValidationService.hasSatisfyConditionType({
          storeCustomField,
          customData,
        });
      if (!hasAvailableType)
        throw new BadRequestException(NOT_AVAILABLE_TYPE_MESSAGE);

      // NOTE: Enum이 정의된경우 Enum의 데이터로 구성되었는가?
      const hasAvailableEnumType =
        this.customFieldValidationService.hasAvailableEnumType({
          storeCustomField,
          customData,
        });
      if (!hasAvailableEnumType)
        throw new BadRequestException(NOT_AVAILABLE_ENUM_MESSAGE);
    }
  }

  createProductCustomFieldRecords({
    storeCustomField,
    customData,
    productId,
  }: {
    storeCustomField: (CustomField & {
      isDefault: CustomFieldDefaultData;
      isEnum: CustomFieldEnumData;
    })[];
    productId: ProductCustomField['id'];
    customData: {
      readonly customFieldId: CustomField['id'];
      readonly content: any[];
    }[];
  }): {
    id: ProductCustomField['id'];
    product: ProductCustomField['product'];
    customField: ProductCustomField['customField'];
    content: ProductCustomField['content'];
    createdAt: ProductCustomField['createdAt'];
  }[] {
    return storeCustomField
      .map((customFieldItem) => {
        const now = this.timeService.now();
        const userCustomDataIndex = customData
          ? customData.findIndex(
              (val) => val.customFieldId === customFieldItem.id,
            )
          : -1;
        const hasFind = userCustomDataIndex !== -1;
        const contentData = hasFind
          ? customData[userCustomDataIndex].content
          : customFieldItem.isDefault?.content;
        const uuid = this.uuidService.generate();

        return {
          id: uuid,
          product: productId,
          customField: customFieldItem.id,
          content: contentData,
          createdAt: now,
        };
      })
      .filter((item) => !!item.content);
  }
}
