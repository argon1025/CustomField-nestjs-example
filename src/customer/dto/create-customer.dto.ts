import { Customer, CustomField } from '@prisma/client';

import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateCustomerCustomDataItemDto {
  @IsString()
  @IsNotEmpty()
  customFieldID: CustomField['id'];

  @IsArray()
  @ArrayNotEmpty()
  content: any[];
}

export class CreateCustomerRequestBodyDto {
  @IsString()
  store: Customer['store'];

  @IsString()
  name: Customer['name'];

  @IsEmail()
  email: Customer['email'];

  @IsString()
  password: Customer['password'];

  @IsOptional()
  @ArrayNotEmpty()
  @Type(() => CreateCustomerCustomDataItemDto)
  @ValidateNested({ each: true })
  customData?: CreateCustomerCustomDataItemDto[];
}
