import { CountryCode } from 'library/constant/constant';

import { ExceptionMessageInterface } from 'library/all-exception/type/all-exception.type';

export const ALREADY_JOINED_MESSAGE: ExceptionMessageInterface = {
  [CountryCode.KR]: '이미 가입된 계정입니다',
  [CountryCode.EN]: 'Account already Joined',
};

export const ADMIN_CREATE_FAIL_MESSAGE: ExceptionMessageInterface = {
  [CountryCode.KR]: '관리자 계정을 생성하는데 실패했습니다',
  [CountryCode.EN]: 'Failed to create administrator account ',
};
