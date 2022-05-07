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
  readonly customFieldID: CustomField['id'];

  @IsArray()
  @ArrayNotEmpty()
  readonly content: any[];
}

export class CreateCustomerRequestBodyDto {
  @IsString()
  readonly store: Customer['store'];

  @IsString()
  readonly name: Customer['name'];

  @IsEmail()
  readonly email: Customer['email'];

  @IsString()
  readonly password: Customer['password'];

  @IsOptional()
  @ArrayNotEmpty()
  @Type(() => CreateCustomerCustomDataItemDto)
  @ValidateNested({ each: true })
  readonly customData?: CreateCustomerCustomDataItemDto[];
}
