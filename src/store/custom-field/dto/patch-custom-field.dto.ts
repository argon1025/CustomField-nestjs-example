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
  id: CustomField['id'];

  @IsOptional()
  @IsString()
  name?: CustomField['name'];

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @ArrayNotEmpty()
  enumData?: any[];

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  defaultData?: any[];
}

export class PatchCustomFieldRequestParamDto {
  @Type(() => String)
  @IsString()
  storeId: Store['id'];
}
