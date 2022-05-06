import { Customer, CustomerCustomField } from '@prisma/client';

export class GetMeCustomerCustomFieldItemDto {
  customFieldId: CustomerCustomField['id'];

  content: any[];
}

export class GetMeCustomerResponseDto {
  userId: Customer['id'];

  storeId: Customer['store'];

  name: Customer['name'];

  email: Customer['email'];

  customField?: GetMeCustomerCustomFieldItemDto[];

  constructor(require: Required<GetMeCustomerResponseDto>) {
    Object.assign(this, require);
  }
}
