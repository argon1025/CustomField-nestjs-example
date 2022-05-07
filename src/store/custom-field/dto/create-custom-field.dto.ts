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
  readonly origin: Origin;

  @IsString()
  readonly name: CustomField['name'];

  @IsBoolean()
  readonly require: CustomField['require'];

  @ApiProperty({ enum: FieldType })
  @IsEnum(FieldType)
  readonly fieldType: FieldType;

  @IsBoolean()
  readonly isArray: CustomField['isArray'];

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

export class CreateCustomFieldRequestQueryDto {
  @Type(() => String)
  @IsString()
  readonly storeId: Store['id'];
}
