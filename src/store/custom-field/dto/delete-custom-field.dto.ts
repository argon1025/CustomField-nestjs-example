import { CustomField, Store } from '@prisma/client';

import { Type } from 'class-transformer';
import { IsString } from 'class-validator';

export class DeleteCustomFieldRequestParamDto {
  @Type(() => String)
  @IsString()
  storeId: Store['id'];

  @Type(() => String)
  @IsString()
  customFieldId: CustomField['id'];
}
