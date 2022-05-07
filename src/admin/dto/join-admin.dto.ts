import { Admin } from '@prisma/client';

import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class JoinAdminRequestBodyDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 30)
  readonly name: Admin['name'];

  @IsEmail()
  @IsNotEmpty()
  @Length(1, 30)
  readonly email: Admin['email'];

  @IsString()
  @IsNotEmpty()
  @Length(7, 30)
  readonly password: Admin['password'];
}
