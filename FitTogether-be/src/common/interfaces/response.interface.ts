export interface ApiResponse<T = any> {
  status: 'success' | 'error' | 'fail';
  code: number;
  message: string;
  data?: T;
  meta?: {
    page?: number;
    pageSize?: number;
    total?: number;
    totalPages?: number;
    [key: string]: any;
  };
  timestamp: string;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface ErrorResponse {
  status: 'error' | 'fail';
  code: number;
  message: string;
  errors?: any[];
  timestamp: string;
}

export interface TokenPayload {
  email: string;
  sub: string; // userId
  iat?: number;
  exp?: number;
}