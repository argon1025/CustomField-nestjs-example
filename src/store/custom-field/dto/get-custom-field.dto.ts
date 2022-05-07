import { ApiProperty } from '@nestjs/swagger';
import { CustomField, FieldType, Origin, Store } from '@prisma/client';

import { Type } from 'class-transformer';
import { IsEnum, IsString } from 'class-validator';

export class GetCustomFieldRequestParamDto {
  @Type(() => String)
  @IsString()
  storeId: Store['id'];
}

export class GetCustomFieldRequestQueryDto {
  @ApiProperty({ enum: Origin })
  @IsEnum(Origin)
  origin: Origin;
}

export class GetCustomFieldItem {
  id: CustomField['id'];

  name: CustomField['name'];

  @ApiProperty({ enum: Origin })
  origin: Origin;

  require: CustomField['require'];

  @ApiProperty({ enum: FieldType })
  fieldType: FieldType;

  isArray: CustomField['isArray'];

  enumData?: any[];

  defaultData?: any[];
}

export class GetCustomFieldResponseDto {
  list: GetCustomFieldItem[];

  constructor(required: Required<GetCustomFieldResponseDto>) {
    Object.assign(this, required);
  }
}
