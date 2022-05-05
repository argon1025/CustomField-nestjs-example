import { CountryCode } from 'library/constant/constant';

import { ExceptionMessageInterface } from 'library/all-exception/type/all-exception.type';

export const CREATE_STORE_FAIL_MESSAGE: ExceptionMessageInterface = {
  [CountryCode.KR]: '스토어 생성에 실패했습니다.',
  [CountryCode.EN]: 'Store Create Fail',
};

export const NOT_FOUND_STORE_MESSAGE: ExceptionMessageInterface = {
  [CountryCode.KR]: '스토어를 찾을 수 없습니다.',
  [CountryCode.EN]: 'Store not found.',
};

export const YOUR_NOT_ADMIN_THIS_STORE_MESSAGE: ExceptionMessageInterface = {
  [CountryCode.KR]: '스토어 관리자만 접근할 수 있습니다.',
  [CountryCode.EN]: 'You re not the manager of the store',
};
