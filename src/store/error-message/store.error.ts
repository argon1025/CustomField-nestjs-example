import { CountryCode } from 'library/constant/constant';

import { ExceptionMessageInterface } from 'library/all-exception/type/all-exception.type';

export const CREATE_STORE_FAIL_MESSAGE: ExceptionMessageInterface = {
  [CountryCode.KR]: '스토어 생성에 실패했습니다.',
  [CountryCode.EN]: 'Store Create Fail',
};
