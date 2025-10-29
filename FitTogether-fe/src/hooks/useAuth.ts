import { useCallback, useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { authService } from '../services/authService';
import type {
  LoginRequest,
  RegisterRequest,
  UpdateProfileRequest,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ApiResponse
} from '../types/auth';
import type { User } from '../types/user';

export interface UseAuthReturn {
  // State
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  accessToken: string | null;
  error: string | null;
  
  // Actions
  login: (credentials: LoginRequest) => Promise<ApiResponse<any>>;
  register: (userData: RegisterRequest) => Promise<ApiResponse<any>>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<ApiResponse<any>>;
  
  // Profile management
  getProfile: () => Promise<ApiResponse<User>>;
  updateProfile: (updates: UpdateProfileRequest) => Promise<ApiResponse<User>>;
  changePassword: (passwordData: ChangePasswordRequest) => Promise<ApiResponse<null>>;
  
  // Password recovery
  forgotPassword: (data: ForgotPasswordRequest) => Promise<ApiResponse<null>>;
  resetPassword: (data: ResetPasswordRequest) => Promise<ApiResponse<null>>;
  
  // Utility functions
  clearError: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuth = (): UseAuthReturn => {
  const { accessToken, status } = useAuthStore();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = status === 'authenticated' && !!accessToken;

  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Login function
  const login = useCallback(async (credentials: LoginRequest): Promise<ApiResponse<any>> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await authService.login(credentials);
      
      if (result.success && result.data) {
        setUser(result.data.user);
        setError(null);
      } else {
        setError(result.error || 'Login failed');
      }
      
      return result;
    } catch (err) {
      const message = 'An error occurred during login';
      setError(message);
      return {
        success: false,
        data: null,
        error: message,
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Register function
  const register = useCallback(async (userData: RegisterRequest): Promise<ApiResponse<any>> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await authService.register(userData);
      
      if (result.success && result.data) {
        setUser(result.data.user);
        setError(null);
      } else {
        setError(result.error || 'Registration failed');
      }
      
      return result;
    } catch (err) {
      const message = 'An error occurred during registration';
      setError(message);
      return {
        success: false,
        data: null,
        error: message,
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Always clear local state
      setUser(null);
      setError(null);
      setIsLoading(false);
    }
  }, []);

  // Refresh token function
  const refreshToken = useCallback(async (): Promise<ApiResponse<any>> => {
    setIsLoading(true);
    
    try {
      const result = await authService.refreshToken();
      
      if (!result.success) {
        // If refresh fails, logout user
        await logout();
      }
      
      return result;
    } catch (err) {
      await logout();
      return {
        success: false,
        data: null,
        error: 'Token refresh failed',
      };
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  // Get profile function
  const getProfile = useCallback(async (): Promise<ApiResponse<User>> => {
    if (!isAuthenticated) {
      return {
        success: false,
        data: null as any,
        error: 'User not logged in',
      };
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const result = await authService.getProfile();
      
      if (result.success && result.data) {
        setUser(result.data);
      } else {
        setError(result.error || 'Unable to get user information');
      }
      
      return result;
    } catch (err) {
      const message = 'An error occurred while fetching information';
      setError(message);
      return {
        success: false,
        data: null as any,
        error: message,
      };
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Update profile function
  const updateProfile = useCallback(async (updates: UpdateProfileRequest): Promise<ApiResponse<User>> => {
    if (!isAuthenticated) {
      return {
        success: false,
        data: null as any,
        error: 'User not logged in',
      };
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const result = await authService.updateProfile(updates);
      
      if (result.success && result.data) {
        setUser(result.data);
      } else {
        setError(result.error || 'Update failed');
      }
      
      return result;
    } catch (err) {
      const message = 'An error occurred during update';
      setError(message);
      return {
        success: false,
        data: null as any,
        error: message,
      };
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Change password function
  const changePassword = useCallback(async (passwordData: ChangePasswordRequest): Promise<ApiResponse<null>> => {
    if (!isAuthenticated) {
      return {
        success: false,
        data: null,
        error: 'User not logged in',
      };
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const result = await authService.changePassword(passwordData);
      
      if (!result.success) {
        setError(result.error || 'Password change failed');
      }
      
      return result;
    } catch (err) {
      const message = 'An error occurred while changing password';
      setError(message);
      return {
        success: false,
        data: null,
        error: message,
      };
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Forgot password function
  const forgotPassword = useCallback(async (data: ForgotPasswordRequest): Promise<ApiResponse<null>> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await authService.forgotPassword(data);
      
      if (!result.success) {
        setError(result.error || 'Failed to send email');
      }
      
      return result;
    } catch (err) {
      const message = 'An error occurred while sending email';
      setError(message);
      return {
        success: false,
        data: null,
        error: message,
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Reset password function
  const resetPassword = useCallback(async (data: ResetPasswordRequest): Promise<ApiResponse<null>> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await authService.resetPassword(data);
      
      if (!result.success) {
        setError(result.error || 'Password reset failed');
      }
      
      return result;
    } catch (err) {
      const message = 'An error occurred while resetting password';
      setError(message);
      return {
        success: false,
        data: null,
        error: message,
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check auth status and get user profile
  const checkAuth = useCallback(async (): Promise<void> => {
    if (!accessToken || status !== 'authenticated') {
      return;
    }

    try {
      const result = await getProfile();
        console.log("checkAuth -> profile:", result);
      if (!result.success) {
        // If profile fetch fails, user might be invalid
        await logout();
      }
    } catch (err) {
      console.error('Auth check error:', err);
      await logout();
    }
  }, [accessToken, status, getProfile, logout]);

  // Effect to check auth on mount and token change
  useEffect(() => {
    if (isAuthenticated && !user) {
      checkAuth();
    }
  }, [isAuthenticated, user, checkAuth]);

  // Effect to clear user when not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setUser(null);
      setError(null);
    }
  }, [isAuthenticated]);

  return {
    // State
    isAuthenticated,
    isLoading,
    user,
    accessToken,
    error,
    
    // Actions
    login,
    register,
    logout,
    refreshToken,
    
    // Profile management
    getProfile,
    updateProfile,
    changePassword,
    
    // Password recovery
    forgotPassword,
    resetPassword,
    
    // Utility functions
    clearError,
    checkAuth,
  };
};
