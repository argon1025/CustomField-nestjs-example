import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import {
  CustomDataItem,
  CustomFieldInfoLists,
} from 'src/store/custom-field/type/custom-field-validation.type';

@Injectable()
export class CustomFieldValidationService {
  // NOTE: dataArray의 모든 아이템이 enumArray에 속한 아이템인지 확인합니다.
  hasIncludeEnumType(enumArray: any[], compareArray: any[]) {
    return compareArray.every((val) => enumArray.includes(val));
  }

  // NOTE: dataArray의 모든아이템 타입이 typeName인지 확인합니다.
  isAvailableDataType(typeName: string, compareArray: any[]) {
    return compareArray.every(
      (val) => typeof val === `${typeName.toLowerCase()}`,
    );
  }

  // NOTE: customData에 storeCustomField에서 정의한 필수 데이터가 있는지 확인합니다
  hasAllRequireData({
    storeCustomField,
    customData,
  }: {
    storeCustomField: CustomFieldInfoLists;
    customData: CustomDataItem[];
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

  // NOTE: customData 각 원소가 isArray(배열 가능)옵션에 위배되는지 확인합니다
  hasArrayAvailable({
    storeCustomField,
    customData,
  }: {
    storeCustomField: CustomFieldInfoLists;
    customData: CustomDataItem[];
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

  // NOTE: customData의 각 원소가 storeCustomField에서 정의한 타입과 일치하는지 확인합니다
  hasSatisfyConditionType({
    storeCustomField,
    customData,
  }: {
    storeCustomField: CustomFieldInfoLists;
    customData: CustomDataItem[];
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

  // NOTE: customData각 원소가 storeCustomField enum에서 정의한 데이터와 일치하는지 확인합니다.
  hasAvailableEnumType({
    storeCustomField,
    customData,
  }: {
    storeCustomField: CustomFieldInfoLists;
    customData: CustomDataItem[];
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
}
