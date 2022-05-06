import { Customer } from '@prisma/client';

import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginCustomerRequestBodyDto {
  @IsEmail()
  @IsNotEmpty()
  email: Customer['email'];

  @IsString()
  @IsNotEmpty()
  password: Customer['password'];
}
