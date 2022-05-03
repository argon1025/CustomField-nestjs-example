import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { swaggerDocumentBuilder } from 'library/swagger/swagger-document.bootstrap';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  swaggerDocumentBuilder(app);

  const configService = app.get<ConfigService>(ConfigService);
  const SERVER_PORT = configService.get<number>('SERVER_PORT', 3000);
  await app.listen(SERVER_PORT);
}
bootstrap();
