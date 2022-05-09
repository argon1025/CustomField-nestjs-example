import { CountryCode } from 'library/constant/constant';

import { ExceptionMessageInterface } from 'library/all-exception/type/all-exception.type';

export const NEED_REQUIRE_DATA_MESSAGE: ExceptionMessageInterface = {
  [CountryCode.KR]: '필수 커스텀데이터가 누락되었습니다.',
  [CountryCode.EN]: 'Required custom field is missing',
};

export const NOT_AVAILABLE_ARRAY_MESSAGE: ExceptionMessageInterface = {
  [CountryCode.KR]: '하나의 항목만 가질 수 있는 커스텀필드가 있습니다.',
  [CountryCode.EN]: 'There is a custom field that can only have one item',
};

export const NOT_AVAILABLE_TYPE_MESSAGE: ExceptionMessageInterface = {
  [CountryCode.KR]:
    '커스텀필드에서 정의한 타입과 일치하지않는 커스텀필드가 있습니다.',
  [CountryCode.EN]:
    'There are custom fields that do not match the type defined in the custom field',
};

export const NOT_AVAILABLE_ENUM_MESSAGE: ExceptionMessageInterface = {
  [CountryCode.KR]:
    'Enum에서 정의한 타입과 일치하지않는 커스텀필드가 있습니다.',
  [CountryCode.EN]:
    'There are custom fields that do not match the type defined by Enum',
};
