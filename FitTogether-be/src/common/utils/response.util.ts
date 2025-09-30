import { ApiResponse, PaginationMeta } from '../interfaces/response.interface';

export class ResponseUtil {
  static success<T>(
    data: T,
    message: string = 'Success',
    code: number = 200,
    meta?: Partial<PaginationMeta>
  ): ApiResponse<T> {
    const response: ApiResponse<T> = {
      status: 'success',
      code,
      message,
      data,
      timestamp: new Date().toISOString(),
    };

    if (meta) {
      response.meta = meta;
    }

    return response;
  }

  static created<T>(
    data: T,
    message: string = 'Created successfully'
  ): ApiResponse<T> {
    return this.success(data, message, 201);
  }

  static updated<T>(
    data: T,
    message: string = 'Updated successfully'
  ): ApiResponse<T> {
    return this.success(data, message, 200);
  }

  static deleted(message: string = 'Deleted successfully'): ApiResponse<null> {
    return this.success(null, message, 200);
  }

  static paginated<T>(
    data: T[],
    meta: PaginationMeta,
    message: string = 'Data retrieved successfully'
  ): ApiResponse<T[]> {
    return {
      status: 'success',
      code: 200,
      message,
      data,
      meta,
      timestamp: new Date().toISOString(),
    };
  }
}

// Pagination helper
export interface PaginationQuery {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export class PaginationUtil {
  static getSkip(page: number, pageSize: number): number {
    return (page - 1) * pageSize;
  }

  static getTotalPages(total: number, pageSize: number): number {
    return Math.ceil(total / pageSize);
  }

  static createMeta(
    page: number,
    pageSize: number,
    total: number
  ): PaginationMeta {
    return {
      page,
      pageSize,
      total,
      totalPages: this.getTotalPages(total, pageSize),
    };
  }

  static validateQuery(query: PaginationQuery): {
    page: number;
    pageSize: number;
    sortBy?: string;
    sortOrder: 'asc' | 'desc';
  } {
    const page = Math.max(1, Number(query.page) || 1);
    const pageSize = Math.min(100, Math.max(1, Number(query.pageSize) || 10));
    const sortOrder = query.sortOrder === 'desc' ? 'desc' : 'asc';

    return {
      page,
      pageSize,
      sortBy: query.sortBy,
      sortOrder,
    };
  }
}