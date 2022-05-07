import { Customer } from '@prisma/client';

import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginCustomerRequestBodyDto {
  @IsEmail()
  @IsNotEmpty()
  @Length(1, 30)
  readonly email: Customer['email'];

  @IsString()
  @IsNotEmpty()
  @Length(1, 30)
  readonly password: Customer['password'];
}
