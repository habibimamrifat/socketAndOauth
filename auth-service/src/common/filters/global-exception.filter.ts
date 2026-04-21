import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch() // catches EVERYTHING
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'something went wrong in internal server';
    let error: any = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object') {
        message = (res as any).message || message;
        error = res;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    console.log('global error', {
      path: request.url,
      method: request.method,
      message,
      stack: exception instanceof Error ? exception.stack : null,
    });

    response.status(status).json({
      success: false,
      status: status,
      message,
      path: request.url,
      timestamp: new Date().toDateString(),
      ...(error && { error }),
    });
  }
}
