import { Admin } from '@prisma/client';

export interface AdminJwtTokenPayload {
  id: Admin['id'];
}
