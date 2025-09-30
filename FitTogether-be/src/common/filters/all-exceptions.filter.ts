import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorResponse } from '../interfaces/response.interface';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: HttpStatus;
    let message: string;
    let errors: any[] = [];

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as any;
        message = responseObj.message || exception.message;
        
        // Handle validation errors
        if (Array.isArray(responseObj.message)) {
          errors = responseObj.message;
          message = 'Validation failed';
        } else if (responseObj.message && Array.isArray(responseObj.message)) {
          errors = responseObj.message;
          message = 'Validation failed';
        }
      } else {
        message = exceptionResponse as string;
      }
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
      console.error('Unexpected error:', exception);
    }

    // Xác định status dựa trên HTTP code
    let statusType: 'error' | 'fail' = 'error';
    if (status >= 400 && status < 500) {
      statusType = 'fail'; // Client error
    } else if (status >= 500) {
      statusType = 'error'; // Server error
    }

    const errorResponse: ErrorResponse = {
      status: statusType,
      code: status,
      message,
      timestamp: new Date().toISOString(),
    };

    // Thêm errors array nếu có validation errors
    if (errors.length > 0) {
      errorResponse.errors = errors;
    }

    response.status(status).json(errorResponse);
  }
}