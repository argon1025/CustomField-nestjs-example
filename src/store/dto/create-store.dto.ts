import { Store } from '@prisma/client';

import { IsString, Length } from 'class-validator';

export class CreateStoreRequestBodyDto {
  @IsString()
  @Length(1, 30)
  name: Store['name'];
}

export class CreateStoreResponseDto {
  storeId: Store['id'];

  constructor(required: Required<CreateStoreResponseDto>) {
    Object.assign(this, required);
  }
}
