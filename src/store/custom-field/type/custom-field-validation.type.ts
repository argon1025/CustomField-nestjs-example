import {
  CustomField,
  CustomFieldDefaultData,
  CustomFieldEnumData,
} from '@prisma/client';

export interface CustomDataItem {
  customFieldID: CustomField['id'];
  content: any[];
}
export type CustomFieldInfoLists = (CustomField & {
  isDefault: CustomFieldDefaultData;
  isEnum: CustomFieldEnumData;
})[];
