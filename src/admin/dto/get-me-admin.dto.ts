import { Admin } from '@prisma/client';

export class GetMeAdminResponseDto {
  readonly name: Admin['name'];

  readonly email: Admin['email'];

  readonly createdAt: Admin['createdAt'];

  constructor(required: Required<GetMeAdminResponseDto>) {
    Object.assign(this, required);
  }
}
