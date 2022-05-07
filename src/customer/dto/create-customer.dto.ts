import { Customer, CustomField } from '@prisma/client';

import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';

export class CreateCustomerCustomDataItemDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 30)
  readonly customFieldID: CustomField['id'];

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(30)
  readonly content: any[];
}

export class CreateCustomerRequestBodyDto {
  @IsString()
  @Length(1, 30)
  readonly store: Customer['store'];

  @IsString()
  @Length(1, 30)
  readonly name: Customer['name'];

  @IsEmail()
  @Length(1, 30)
  readonly email: Customer['email'];

  @IsString()
  @Length(7, 30)
  readonly password: Customer['password'];

  @IsOptional()
  @ArrayNotEmpty()
  @Type(() => CreateCustomerCustomDataItemDto)
  @ValidateNested({ each: true })
  readonly customData?: CreateCustomerCustomDataItemDto[];
}
