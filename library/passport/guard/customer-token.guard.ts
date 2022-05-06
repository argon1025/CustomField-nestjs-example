import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import {
  JWT_VERIFICATION_FAIL_MESSAGE,
  NEED_JWT_TOKEN_MESSAGE,
} from 'library/jwt/error-message/admin-token.error';

@Injectable()
class CustomerToken extends AuthGuard('customer-token') {
  // NOTE: 에러를 핸들링 한다
  handleRequest<TUser>(err: Error, user: TUser) {
    if (err) throw new ForbiddenException(JWT_VERIFICATION_FAIL_MESSAGE);
    if (!user) throw new UnauthorizedException(NEED_JWT_TOKEN_MESSAGE);
    return user;
  }
}
export const CustomerTokenGuard = () => UseGuards(CustomerToken);
