import { Module, Provider } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from 'library/all-exception/all-exception.filter';
import { AppController } from './app.controller';
import { AppService } from './app.service';

const allExceptionsFilterProvider: Provider = {
  provide: APP_FILTER,
  useClass: AllExceptionsFilter,
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `environments/.${process.env.NODE_ENV}.env`,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, allExceptionsFilterProvider],
})
export class AppModule {}
