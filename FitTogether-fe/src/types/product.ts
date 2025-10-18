export interface Product {
  id: string;
  name: string;
  description?: string;
  nation?: string;
  categoryId: string;
  category?: {
    _id: string;
    name: string;
    description: string;
  };
  price: number;
  quantity: number;
  urlImgs: string[];
  isDeleted: boolean;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStock?: boolean;
  featured?: boolean;
  search?: string;
}

export interface ProductSort {
  field: 'name' | 'price' | 'rating' | 'createdAt';
  order: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Review {
  id: number;
  userId: number;
  productId: number;
  rating: number;
  comment: string;
  images?: string[];
  verified: boolean;
  createdAt: string;
  user: Pick<import('./user').User, 'firstName' | 'lastName' | 'avatar'>;
}

export interface ProductListResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  nation?: string;
  categoryId: string;
  price: number;
  quantity: number;
  urlImgs?: string[];
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  nation?: string;
  categoryId?: string;
  price?: number;
  quantity?: number;
  urlImgs?: string[];
}
 
export interface ProductListParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  categoryId?: string;
  sortBy?: 'name' | 'price' | 'rating' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  featured?: boolean;
  inStock?: boolean;
  difficulty?: 'easy' | 'medium' | 'hard';
}