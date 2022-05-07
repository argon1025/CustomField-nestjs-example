import { ApiProperty } from '@nestjs/swagger';
import { CustomField, FieldType, Origin, Store } from '@prisma/client';

import { Type } from 'class-transformer';
import { IsEnum, IsString, Length } from 'class-validator';

export class GetCustomFieldRequestParamDto {
  @Type(() => String)
  @IsString()
  @Length(1, 30)
  readonly storeId: Store['id'];
}

export class GetCustomFieldRequestQueryDto {
  @ApiProperty({ enum: Origin })
  @IsEnum(Origin)
  readonly origin: Origin;
}

export class GetCustomFieldItem {
  readonly id: CustomField['id'];

  readonly name: CustomField['name'];

  @ApiProperty({ enum: Origin })
  readonly origin: Origin;

  readonly require: CustomField['require'];

  @ApiProperty({ enum: FieldType })
  readonly fieldType: FieldType;

  readonly isArray: CustomField['isArray'];

  readonly enumData?: any[];

  readonly defaultData?: any[];
}

export class GetCustomFieldResponseDto {
  readonly list: GetCustomFieldItem[];

  constructor(required: Required<GetCustomFieldResponseDto>) {
    Object.assign(this, required);
  }
}
