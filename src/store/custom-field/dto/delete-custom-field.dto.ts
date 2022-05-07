import { CustomField, Store } from '@prisma/client';

import { Type } from 'class-transformer';
import { IsString, Length } from 'class-validator';

export class DeleteCustomFieldRequestParamDto {
  @Type(() => String)
  @IsString()
  @Length(1, 30)
  readonly storeId: Store['id'];

  @Type(() => String)
  @IsString()
  @Length(1, 30)
  readonly customFieldId: CustomField['id'];
}
