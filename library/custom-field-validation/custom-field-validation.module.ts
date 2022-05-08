import { Module } from '@nestjs/common';

import { CustomFieldValidationService } from 'library/custom-field-validation/custom-field-validation.service';

@Module({
  providers: [CustomFieldValidationService],
  exports: [CustomFieldValidationService],
})
export class CustomFieldValidationModule {}
