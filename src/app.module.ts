import { Module, Provider } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from 'library/all-exception/all-exception.filter';
import { AppController } from './app.controller';
import { AppService } from './app.service';

const allExceptionsFilterProvider: Provider = {
  provide: APP_FILTER,
  useClass: AllExceptionsFilter,
};

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, allExceptionsFilterProvider],
})
export class AppModule {}
