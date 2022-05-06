import { CountryCode } from 'library/constant/constant';

import { ExceptionMessageInterface } from 'library/all-exception/type/all-exception.type';

export const CUSTOMER_CREATE_FAIL_MESSAGE: ExceptionMessageInterface = {
  [CountryCode.KR]: '유저를 생성하는데 실패했습니다.',
  [CountryCode.EN]: 'Customer Create Fail',
};

export const CUSTOMER_ALREADY_JOIN_MESSAGE: ExceptionMessageInterface = {
  [CountryCode.KR]: '이미 가입된 회원입니다.',
  [CountryCode.EN]: 'Customer already joined',
};
