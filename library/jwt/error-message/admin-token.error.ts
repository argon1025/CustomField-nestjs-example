import { CountryCode } from 'library/constant/constant';

import { ExceptionMessageInterface } from 'library/all-exception/type/all-exception.type';

export const JWT_VERIFICATION_FAIL_MESSAGE: ExceptionMessageInterface = {
  [CountryCode.KR]: 'JWT 토큰 인증에 실패했습니다',
  [CountryCode.EN]: 'JWT verification fail',
};

export const NEED_JWT_TOKEN_MESSAGE: ExceptionMessageInterface = {
  [CountryCode.KR]: '로그인해주세요',
  [CountryCode.EN]: 'You need login',
};
