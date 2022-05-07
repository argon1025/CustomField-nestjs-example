import { Customer, CustomerCustomField, CustomField } from '@prisma/client';

export class GetMeCustomerCustomFieldItemDto {
  readonly name: CustomField['name'];

  readonly customFieldId: CustomerCustomField['id'];

  readonly content: any[];
}

export class GetMeCustomerResponseDto {
  readonly userId: Customer['id'];

  readonly storeId: Customer['store'];

  readonly name: Customer['name'];

  readonly email: Customer['email'];

  readonly customField?: GetMeCustomerCustomFieldItemDto[];

  constructor(require: Required<GetMeCustomerResponseDto>) {
    Object.assign(this, require);
  }
}
