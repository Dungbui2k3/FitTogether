export type UserRole = 'admin' | 'user' | 'field_owner';

export interface User {
  _id: string;
  id: number;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role?: UserRole;
  code?: number;
  isVerified?: boolean;
  createdAt: string;
  updatedAt: string;
  points: number;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  phone?: string;
  address?: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  role?: UserRole;
  phone?: string;
  address?: string;
  status?: "active" | "inactive";
}

export interface UserListParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: "active" | "inactive";
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  email?: string;
}

export interface UserListResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
