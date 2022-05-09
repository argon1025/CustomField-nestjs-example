import { CustomField, Product } from '@prisma/client';

import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  Length,
  IsArray,
  ArrayNotEmpty,
  ArrayMaxSize,
  IsOptional,
  ValidateNested,
} from 'class-validator';

export class CreateProductCustomDataItemDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 30)
  readonly customFieldId: CustomField['id'];

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(30)
  readonly content: any[];
}

export class CreateProductRequestBodyDto {
  @IsString()
  @Length(1, 30)
  storeId: Product['store'];

  @IsString()
  @Length(1, 30)
  name: Product['name'];

  @IsString()
  @Length(1, 30)
  price: Product['price'];

  @IsOptional()
  @ArrayNotEmpty()
  @Type(() => CreateProductCustomDataItemDto)
  @ValidateNested({ each: true })
  readonly customData?: CreateProductCustomDataItemDto[];
}
