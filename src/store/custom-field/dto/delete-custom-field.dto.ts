import { CustomField, Store } from '@prisma/client';

import { Type } from 'class-transformer';
import { IsString } from 'class-validator';

export class DeleteCustomFieldRequestParamDto {
  @Type(() => String)
  @IsString()
  readonly storeId: Store['id'];

  @Type(() => String)
  @IsString()
  readonly customFieldId: CustomField['id'];
}
