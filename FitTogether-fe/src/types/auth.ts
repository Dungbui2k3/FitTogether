import { User } from './user';

// Base API Response
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  status?: number;
}

// Auth Request/Response Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginApiResponse {
  data: {
    user: User;
    access_token: string;
    refresh_token: string;
  };
  message: string;
  status: number;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface RegisterApiResponse {
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
  message: string;
  status: number;
}

export interface UpdateProfileRequest {
  name?: string;
  avatar?: string;
  email?: string;
  points?: number;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  data: {
    accessToken: string;
    refreshToken: string;
  };
  message: string;
  status: number;
}