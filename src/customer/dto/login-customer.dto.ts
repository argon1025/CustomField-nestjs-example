import { Customer } from '@prisma/client';

import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginCustomerRequestBodyDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email: Customer['email'];

  @IsString()
  @IsNotEmpty()
  readonly password: Customer['password'];
}
