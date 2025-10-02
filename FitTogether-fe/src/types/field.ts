export interface Field {
  id: string;
  name: string;
  address: string;
  phone: string;
  facilities: string[];
  description?: string;
  images?: string[];
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface CreateFieldRequest {
  name: string;
  address: string;
  phone: string;
  facilities: string[];
  description?: string;
  images?: string[];
}

export interface UpdateFieldRequest {
  name?: string;
  address?: string;
  phone?: string;
  facilities?: string[];
  description?: string;
  images?: string[];
}

export interface FieldFilter {
  search?: string;
  isDeleted?: boolean;
  location?: string;
}

export interface FieldSort {
  field: 'name' | 'address' | 'createdAt' | 'updatedAt';
  order: 'asc' | 'desc';
}

export interface FieldListParams {
  page?: number;
  limit?: number;
  search?: string;
  isDeleted?: boolean;
  sortBy?: 'name' | 'address' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface FieldListResponse {
  fields: Field[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
