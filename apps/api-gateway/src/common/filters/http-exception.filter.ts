import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

/** 统一错误响应接口 */
interface ErrorResponse {
  code: number;
  message: string;
  data: null;
  timestamp: string;
  path: string;
}

/**
 * HTTP异常过滤器
 * 统一处理所有HTTP异常，返回标准错误格式
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: string;
    let code: number;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const resp = exceptionResponse as Record<string, unknown>;
        message = (resp.message as string) || exception.message;

        // class-validator 的验证错误返回的是数组
        if (Array.isArray(resp.message)) {
          message = resp.message.join('; ');
        }
      } else {
        message = exception.message;
      }

      code = status;
    } else {
      // 非HTTP异常，记录错误日志
      this.logger.error('未捕获的异常:', exception);
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = '服务器内部错误';
      code = status;
    }

    const errorResponse: ErrorResponse = {
      code,
      message,
      data: null,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    this.logger.warn(
      `${request.method} ${request.url} - ${status} - ${message}`,
    );

    response.status(status).json(errorResponse);
  }
}
