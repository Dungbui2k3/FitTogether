import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../interfaces/response.interface';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    
    return next.handle().pipe(
      map((data) => {
        // Nếu data đã có format chuẩn thì return luôn
        if (data && typeof data === 'object' && 'status' in data && 'code' in data) {
          return data;
        }

        // Format lại response theo chuẩn
        const statusCode = response.statusCode;
        let message = 'Success';
        
        // Tùy chỉnh message theo method và status code
        if (request.method === 'POST' && statusCode === 201) {
          message = 'Created successfully';
        } else if (request.method === 'PUT' || request.method === 'PATCH') {
          message = 'Updated successfully';
        } else if (request.method === 'DELETE') {
          message = 'Deleted successfully';
        }

        const result: ApiResponse<T> = {
          status: 'success',
          code: statusCode,
          message,
          data,
          timestamp: new Date().toISOString(),
        };

        // Thêm meta nếu có pagination info
        if (data && typeof data === 'object' && 'meta' in data) {
          result.meta = data.meta;
          result.data = data.data || data;
        }

        return result;
      }),
    );
  }
}