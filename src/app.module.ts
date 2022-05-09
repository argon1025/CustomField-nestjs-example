import {
  BadRequestException,
  ClassSerializerInterceptor,
  Module,
  Provider,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';

import { CustomerModule } from './customer/customer.module';
import { ProductModule } from './product/product.module';
import { AllExceptionsFilter } from 'library/all-exception/all-exception.filter';
import { CountryCode } from 'library/constant/constant';
import { AdminModule } from 'src/admin/admin.module';
import { StoreModule } from 'src/store/store.module';

import { ExceptionMessageInterface } from 'library/all-exception/type/all-exception.type';

const allExceptionsFilterProvider: Provider = {
  provide: APP_FILTER,
  useClass: AllExceptionsFilter,
};

const classSerializerInterceptorProvider: Provider = {
  provide: APP_INTERCEPTOR,
  useClass: ClassSerializerInterceptor,
};

const validationPipeProvider: Provider = {
  provide: APP_PIPE,
  useValue: new ValidationPipe({
    // NOTE: JSON 페이로드를 DTO 프로퍼티에 지정된 타입으로 변환합니다
    transform: true,
    // NOTE: validation 데코레이터가 없는 모든 프로퍼티를 제거합니다
    whitelist: true,
    // NOTE: 알수없는 프로퍼티가 유효성 검사를 통과하는것을 막습니다
    forbidUnknownValues: true,
    exceptionFactory: (errors: ValidationError[]) => {
      if (!errors[0]?.constraints) return new BadRequestException();
      const firstKey = Object.keys(errors[0].constraints)[0];
      const errorMessage: ExceptionMessageInterface = {
        [CountryCode.EN]: errors[0].constraints[`${firstKey}`],
      };
      return new BadRequestException(errorMessage);
    },
  }),
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `environments/.${process.env.NODE_ENV}.env`,
    }),
    AdminModule,
    StoreModule,
    CustomerModule,
    ProductModule,
  ],
  providers: [
    allExceptionsFilterProvider,
    classSerializerInterceptorProvider,
    validationPipeProvider,
  ],
})
export class AppModule {}
