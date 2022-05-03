import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

import {
  isCustomExceptionMessageInterface,
  CustomExceptionResponseInterface,
} from 'library/all-exception/type/all-exception.type';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();

    // NOTE: HTTPException인가?
    const isHttpException = exception instanceof HttpException;
    // NOTE: HttpException이 아니라면 500 에러 코드를 할당한다
    const httpStatusCode = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    // NOTE: HTTPException라면 에러 메시지를 로드한다
    const exceptionData = isHttpException ? exception.getResponse() : null;
    // NOTE: 프로젝트에서 정의된 CustomExceptionMessage인지 체크한다
    const isCustomMessage = isCustomExceptionMessageInterface(exceptionData);

    // NOTE: 에러 메시지를 작성한다, CustomExceptionMessage가 아닐경우엔 에러 메시지를 추가하지 않는다
    const responseData: CustomExceptionResponseInterface = {
      statusCode: httpStatusCode,
      location: request.url,
      message: isCustomMessage ? exceptionData : undefined,
    };

    // TODO: 개발 진행중 핸들링 하지 않은 에러 모니터링 수단, 배포시 APM으로 연동해야 한다.
    if (httpStatusCode === HttpStatus.INTERNAL_SERVER_ERROR || !isHttpException)
      Logger.error(exception);

    httpAdapter.reply(ctx.getResponse(), responseData, httpStatusCode);
  }
}
