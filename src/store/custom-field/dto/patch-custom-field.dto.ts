import { CustomField, Store } from '@prisma/client';

import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsOptional,
  IsString,
} from 'class-validator';

export class PatchCustomFieldRequestBodyDto {
  @IsString()
  readonly id: CustomField['id'];

  @IsOptional()
  @IsString()
  readonly name?: CustomField['name'];

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @ArrayNotEmpty()
  readonly enumData?: any[];

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  readonly defaultData?: any[];
}

export class PatchCustomFieldRequestParamDto {
  @Type(() => String)
  @IsString()
  readonly storeId: Store['id'];
}
