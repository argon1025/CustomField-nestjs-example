import { CountryCode } from 'library/constant/constant';

import { ExceptionMessageInterface } from 'library/all-exception/type/all-exception.type';

export const NOT_AVAILABLE_TYPE_ENUM_MESSAGE: ExceptionMessageInterface = {
  [CountryCode.KR]:
    '커스텀필드에서 정의한 타입과 Enum 타입이 일치하지 않습니다.',
  [CountryCode.EN]: 'not available type',
};

export const DEFAULT_DATA_HAVE_ONLY_ONE_ITEM_MESSAGE: ExceptionMessageInterface =
  {
    [CountryCode.KR]:
      '해당 커스텀 데이터의 기본값으로는 하나의 아이템만 배열에 삽입할 수 있습니다.',
    [CountryCode.EN]: 'This Default data can have only one item',
  };

export const DEFAULT_DATA_NOT_AVAILABLE_TYPE_MESSAGE: ExceptionMessageInterface =
  {
    [CountryCode.KR]:
      '커스텀필드에서 정의한 타입과 기본값의 타입이 일치하지 않습니다.',
    [CountryCode.EN]: 'not available type',
  };

export const DEFAULT_DATA_MUST_CONTAINED_ENUM_MESSAGE: ExceptionMessageInterface =
  {
    [CountryCode.KR]: 'Enum에서 정의한 원소들로만 기본데이터를 구성해야합니다.',
    [CountryCode.EN]: 'default data must contain enum data',
  };

export const NEW_ENUM_MUST_CONTAINED_PREVIOUS_MESSAGE: ExceptionMessageInterface =
  {
    [CountryCode.KR]: '이전에 정의한 Enum 데이터가 모두 포함되어야합니다.',
    [CountryCode.EN]: 'new enum data must be contained pervious data',
  };

export const NOT_FOUND_CUSTOM_FIELD_MESSAGE: ExceptionMessageInterface = {
  [CountryCode.KR]: '존재하지않는 커스텀필드 입니다.',
  [CountryCode.EN]: 'Not found customField',
};

export const NOT_OWNER_CUSTOM_FIELD_MESSAGE: ExceptionMessageInterface = {
  [CountryCode.KR]: '해당 스토어에서 관리하는 커스텀필드가 아닙니다',
  [CountryCode.EN]: 'this custom Field was not in this store',
};
