import { ApiResponce } from '@/types/api-responce.type';
import {
  Catch,
  type ExceptionFilter,
  HttpException,
  HttpStatus,
  type ArgumentsHost,
  Logger,
} from '@nestjs/common';

const extractMessage = (payload: unknown): string => {
  if (!payload) {
    return 'Unexpected error';
  }
  if (typeof payload === 'string') {
    return payload;
  }
  if (typeof payload === 'object') {
    if ('message' in payload && typeof payload.message === 'string') {
      return payload.message;
    }
    return JSON.stringify(payload);
  }
  return String(payload);
};

@Catch()
export class CustomHttpExceptionFilter implements ExceptionFilter {
  private readonly logger: Logger = new Logger(CustomHttpExceptionFilter.name)

  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();

    const isHttpException = exception instanceof HttpException;

    const httpStatus = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const rawPayload = exception?.getResponse
      ? exception.getResponse()
      : exception?.message;
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const request_info = request
      ? {
        method: request.method,
        url: request.url ?? request.originalUrl,
        headers: request.headers,
        query: request.query,
        body: request.body,
      }
      : null;

    const apiResponse: ApiResponce<any> = {
      success: false,
      message: {
        error: exception?.name ?? 'Error',
        message: extractMessage(rawPayload),
        statusCode: httpStatus,
        timestamp: new Date().toISOString(),
        path: request_info?.url,
        //details: typeof rawPayload === 'string' ? undefined : rawPayload,
      },
    };

    this.logger.error(
      //@ts-ignore
      `EXCEPTION THROWN [${apiResponse.message.error}] status=${httpStatus}`,
      exception?.stack ?? exception?.message,
    );
    if (request_info) {
      console.log({ request_info });
    }
    console.log(apiResponse);
    response.status(httpStatus).send(apiResponse);
  }
}
