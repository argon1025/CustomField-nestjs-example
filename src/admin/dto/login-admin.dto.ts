import { Admin } from '@prisma/client';

import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginAdminRequestBodyDto {
  @IsEmail()
  @IsNotEmpty()
  @Length(1, 30)
  email: Admin['email'];

  @IsString()
  @IsNotEmpty()
  @Length(7, 30)
  password: Admin['password'];
}
