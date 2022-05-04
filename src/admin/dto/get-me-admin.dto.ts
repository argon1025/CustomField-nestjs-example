import { Admin } from '@prisma/client';

export class GetMeAdminResponseDto {
  name: Admin['name'];

  email: Admin['email'];

  createdAt: Admin['createdAt'];

  constructor(required: Required<GetMeAdminResponseDto>) {
    Object.assign(this, required);
  }
}
