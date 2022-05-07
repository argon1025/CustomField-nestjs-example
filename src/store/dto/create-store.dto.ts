import { Store } from '@prisma/client';

import { IsString, Length } from 'class-validator';

export class CreateStoreRequestBodyDto {
  @IsString()
  @Length(1, 30)
  readonly name: Store['name'];
}

export class CreateStoreResponseDto {
  readonly storeId: Store['id'];

  constructor(required: Required<CreateStoreResponseDto>) {
    Object.assign(this, required);
  }
}
