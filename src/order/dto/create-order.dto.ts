import { CustomField } from '@prisma/client';

import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';

export class CreateOrderCustomDataItemDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 30)
  readonly customFieldId: CustomField['id'];

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(30)
  readonly content: any[];
}

export class CreateOrderRequestBodyDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(30)
  readonly products: string[];

  @IsOptional()
  @ArrayNotEmpty()
  @Type(() => CreateOrderCustomDataItemDto)
  @ValidateNested({ each: true })
  readonly customData?: CreateOrderCustomDataItemDto[];
}
