import { ApiProperty } from '@nestjs/swagger';
import { CustomField, FieldType, Origin, Store } from '@prisma/client';

import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCustomFieldRequestBodyDto {
  @ApiProperty({ enum: Origin })
  @IsEnum(Origin)
  origin: Origin;

  @IsBoolean()
  require: CustomField['require'];

  @ApiProperty({ enum: FieldType })
  @IsEnum(FieldType)
  fieldType: FieldType;

  @IsBoolean()
  isArray: CustomField['isArray'];

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

export class CreateCustomFieldRequestQueryDto {
  @Type(() => String)
  @IsString()
  storeId: Store['id'];
}
