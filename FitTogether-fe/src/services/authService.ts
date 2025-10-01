import { authInstance } from '../utils/api';
import { useAuthStore } from '../stores/authStore';
import type {
  LoginRequest,
  LoginApiResponse,
  RegisterRequest,
  RegisterApiResponse,
  ApiResponse,
  UpdateProfileRequest,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  RefreshTokenResponse
} from '../types/auth';
import type { User } from '../types/user';

class AuthService {
  /**
   * User login
   */
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginApiResponse['data']>> {
    try {
      const response = await authInstance.post<LoginApiResponse>('/login', credentials);

      if (response.data?.data?.access_token) {
        console.log('Setting access token in store');
        useAuthStore.getState().setAccessToken(response.data.data.access_token);

        // if (response.data.data.refresh_token) {
        //   localStorage.setItem('refresh_token', response.data.data.refresh_token);
        // }
      }

      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Login successful',
        status: response.status,
      };
    } catch (error: any) {
      console.error('Login error:', error);
      
      const message = error.response?.data?.message || error.message || 'Login failed';
      return {
        success: false,
        data: null as any,
        error: message,
        status: error.response?.status || 500,
      };
    }
  }

  /**
   * Register new user
   */
  async register(userData: RegisterRequest): Promise<ApiResponse<RegisterApiResponse['data']>> {
    try {
      const response = await authInstance.post<RegisterApiResponse>('/register', userData);
      
      if (response.data?.data?.accessToken) {
        useAuthStore.getState().setAccessToken(response.data.data.accessToken);
        
        if (response.data.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.data.refreshToken);
        }
      }

      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Registration successful',
        status: response.status,
      };
    } catch (error: any) {
      console.error('Register error:', error);
      
      const message = error.response?.data?.message || error.message || 'Registration failed';
      return {
        success: false,
        data: null as any,
        error: message,
        status: error.response?.status || 500,
      };
    }
  }

  /**
   * User logout
   */
  async logout(): Promise<ApiResponse<null>> {
    try {
      // Call logout endpoint (optional)
      await authInstance.post('/logout');
      
      // Clear tokens
      this.clearTokens();
      
      return {
        success: true,
        data: null,
        message: 'Logout successful',
      };
    } catch (error: any) {
      // Even if logout fails on server, clear local tokens
      this.clearTokens();
      
      return {
        success: true,
        data: null,
        message: 'Logout successful',
      };
    }
  }

  /**
   * Get user profile information
   */
  async getProfile(): Promise<ApiResponse<User>> {
    try {
      const response = await authInstance.get<{ data: User }>('/profile');
      
      return {
        success: true,
        data: response.data.data,
        message: 'Profile retrieved successfully',
        status: response.status,
      };
    } catch (error: any) {
      console.error('Get profile error:', error);
      
      const message = error.response?.data?.message || error.message || 'Unable to get user information';
      return {
        success: false,
        data: null as any,
        error: message,
        status: error.response?.status || 500,
      };
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(updates: UpdateProfileRequest): Promise<ApiResponse<User>> {
    try {
      const response = await authInstance.put<{ data: User }>('/profile', updates);
      
      return {
        success: true,
        data: response.data.data,
        message: 'Profile updated successfully',
        status: response.status,
      };
    } catch (error: any) {
      console.error('Update profile error:', error);
      
      const message = error.response?.data?.message || error.message || 'Update failed';
      return {
        success: false,
        data: null as any,
        error: message,
        status: error.response?.status || 500,
      };
    }
  }

  /**
   * Change password
   */
  async changePassword(passwordData: ChangePasswordRequest): Promise<ApiResponse<null>> {
    try {
      const response = await authInstance.post('/change-password', passwordData);
      
      return {
        success: true,
        data: null,
        message: 'Password changed successfully',
        status: response.status,
      };
    } catch (error: any) {
      console.error('Change password error:', error);
      
      const message = error.response?.data?.message || error.message || 'Password change failed';
      return {
        success: false,
        data: null,
        error: message,
        status: error.response?.status || 500,
      };
    }
  }

  /**
   * Forgot password - send reset email
   */
  async forgotPassword(data: ForgotPasswordRequest): Promise<ApiResponse<null>> {
    try {
      const response = await authInstance.post('/forgot-password', data);
      
      return {
        success: true,
        data: null,
        message: 'Password reset email has been sent',
        status: response.status,
      };
    } catch (error: any) {
      console.error('Forgot password error:', error);
      
      const message = error.response?.data?.message || error.message || 'Failed to send email';
      return {
        success: false,
        data: null,
        error: message,
        status: error.response?.status || 500,
      };
    }
  }

  /**
   * Reset password with token
   */
  async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse<null>> {
    try {
      const response = await authInstance.post('/reset-password', data);
      
      return {
        success: true,
        data: null,
        message: 'Password reset successfully',
        status: response.status,
      };
    } catch (error: any) {
      console.error('Reset password error:', error);
      
      const message = error.response?.data?.message || error.message || 'Password reset failed';
      return {
        success: false,
        data: null,
        error: message,
        status: error.response?.status || 500,
      };
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<ApiResponse<RefreshTokenResponse['data']>> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token found');
      }

      const response = await authInstance.post<RefreshTokenResponse>('/refresh', {
        refreshToken,
      });
      
      if (response.data?.data?.accessToken) {
        // Update access token in store
        useAuthStore.getState().setAccessToken(response.data.data.accessToken);
        
        // Update refresh token if provided
        if (response.data.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.data.refreshToken);
        }
      }

      return {
        success: true,
        data: response.data.data,
        message: 'Token refreshed successfully',
        status: response.status,
      };
    } catch (error: any) {
      console.error('Refresh token error:', error);
      
      // Clear tokens on refresh failure
      this.clearTokens();
      
      const message = error.response?.data?.message || error.message || 'Token refresh failed';
      return {
        success: false,
        data: null as any,
        error: message,
        status: error.response?.status || 500,
      };
    }
  }

  /**
   * Check login status
   */
  isAuthenticated(): boolean {
    const { accessToken, status } = useAuthStore.getState();
    return !!accessToken && status === 'authenticated';
  }

  /**
   * Get current access token
   */
  getAccessToken(): string | null {
    return useAuthStore.getState().accessToken;
  }

  /**
   * Clear all tokens
   */
  private clearTokens(): void {
    useAuthStore.getState().removeAccessToken();
    localStorage.removeItem('refreshToken');
  }
}

// Export singleton instance
export const authService = new AuthService();
