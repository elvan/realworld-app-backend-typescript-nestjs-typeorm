import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: exception.message || null,
      errors: this.getErrorMessages(exception),
    };

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `${request.method} ${request.url}`,
        exception.stack,
        HttpExceptionFilter.name,
      );
    } else {
      this.logger.error(
        `${request.method} ${request.url}`,
        JSON.stringify(errorResponse),
        HttpExceptionFilter.name,
      );
    }

    response.status(status).json(errorResponse);
  }

  private getErrorMessages(exception: HttpException): any {
    const response = exception.getResponse() as any;
    // If this is a validation error, return the validation errors
    if (response.errors && Array.isArray(response.errors)) {
      return response.errors;
    }
    // For validation pipe errors
    if (response.message && Array.isArray(response.message)) {
      return response.message;
    }
    return response.errors || response.message || exception.message;
  }
}
