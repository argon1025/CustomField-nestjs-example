import { Customer } from '@prisma/client';

export interface CustomerJwtTokenPayload {
  id: Customer['id'];
}
