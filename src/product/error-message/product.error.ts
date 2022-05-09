import { CountryCode } from 'library/constant/constant';

import { ExceptionMessageInterface } from 'library/all-exception/type/all-exception.type';

export const PRODUCT_CREATE_FAIL_MESSAGE: ExceptionMessageInterface = {
  [CountryCode.KR]: '상품을 생성하는데 실패했습니다.',
  [CountryCode.EN]: 'Product Create Fail',
};
