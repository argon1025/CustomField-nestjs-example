import { ApiProperty } from '@nestjs/swagger';
import { CustomField, FieldType, Origin, Store } from '@prisma/client';

import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateCustomFieldRequestBodyDto {
  @ApiProperty({ enum: Origin })
  @IsEnum(Origin)
  readonly origin: Origin;

  @IsString()
  @Length(1, 30)
  readonly name: CustomField['name'];

  @IsBoolean()
  readonly require: CustomField['require'];

  @IsOptional()
  @IsBoolean()
  readonly onlyAdmin: CustomField['onlyAdmin'];

  @ApiProperty({ enum: FieldType })
  @IsEnum(FieldType)
  readonly fieldType: FieldType;

  @IsBoolean()
  readonly isArray: CustomField['isArray'];

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

export class CreateCustomFieldRequestQueryDto {
  @Type(() => String)
  @IsString()
  readonly storeId: Store['id'];
}
