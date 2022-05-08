import {
  CustomField,
  CustomFieldDefaultData,
  CustomFieldEnumData,
} from '@prisma/client';

export interface CustomDataItem {
  customFieldID: CustomField['id'];
  content: any[];
}
export type CustomFieldInfoLists = CustomFieldInfoItem[];

export type CustomFieldInfoItem = CustomField & {
  isDefault: CustomFieldDefaultData;
  isEnum: CustomFieldEnumData;
};
