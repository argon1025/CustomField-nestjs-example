import { CustomField, Store } from '@prisma/client';

import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class PatchCustomFieldRequestBodyDto {
  @IsString()
  @Length(1, 30)
  readonly id: CustomField['id'];

  @IsOptional()
  @IsString()
  @Length(1, 30)
  readonly name?: CustomField['name'];

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @ArrayNotEmpty()
  @ArrayMaxSize(30)
  readonly enumData?: any[];

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(30)
  readonly defaultData?: any[];
}

export class PatchCustomFieldRequestParamDto {
  @Type(() => String)
  @IsString()
  @Length(1, 30)
  readonly storeId: Store['id'];
}
