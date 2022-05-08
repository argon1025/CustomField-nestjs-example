import { Customer, CustomField, Store } from '@prisma/client';

import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';

export class PatchCustomerForStoreRequestParamDto {
  @Type(() => String)
  @IsString()
  @Length(1, 30)
  readonly storeId: Store['id'];

  @Type(() => String)
  @IsString()
  @Length(1, 30)
  readonly customerId: Customer['id'];
}

class CustomDataItem {
  @IsString()
  @IsNotEmpty()
  readonly customFieldId: CustomField['id'];

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(30)
  readonly content: any[];
}

export class PatchCustomerForStoreRequestBodyDto {
  @IsOptional()
  readonly name: Customer['name'];

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @ArrayNotEmpty()
  @ArrayMaxSize(30)
  @Type(() => CustomDataItem)
  @ValidateNested({ each: true })
  readonly customData?: CustomDataItem[];
}
