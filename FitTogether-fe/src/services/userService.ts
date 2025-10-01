import { backendInstance } from '../utils/api';
import type { ApiResponse } from '../types/auth';
import type { CreateUserRequest, UpdateUserRequest, User, UserListParams, UserListResponse } from '../types/user';


class UserService {
  /**
   * Lấy danh sách người dùng
   */
  async getUsers(params: UserListParams = {}): Promise<ApiResponse<UserListResponse>> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.search) queryParams.append('search', params.search);
      if (params.role) queryParams.append('role', params.role);
      if (params.status) queryParams.append('status', params.status);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
      if (params.email) queryParams.append('email', params.email);

      const response = await backendInstance.get<{ data: UserListResponse }>(
        `/users?${queryParams.toString()}`
      );
      
      return {
        success: true,
        data: response.data.data,
        message: 'Lấy danh sách người dùng thành công',
        status: response.status,
      };
    } catch (error: any) {
      console.error('Get users error:', error);
      
      const message = error.response?.data?.message || error.message || 'Không thể lấy danh sách người dùng';
      return {
        success: false,
        data: null as any,
        error: message,
        status: error.response?.status || 500,
      };
    }
  }

  /**
   * Lấy thông tin chi tiết một người dùng
   */
  async getUserById(id: string): Promise<ApiResponse<User>> {
    try {
      const response = await backendInstance.get<{ data: User }>(`/users/${id}`);
      
      return {
        success: true,
        data: response.data.data,
        message: 'Lấy thông tin người dùng thành công',
        status: response.status,
      };
    } catch (error: any) {
      console.error('Get user by id error:', error);
      
      const message = error.response?.data?.message || error.message || 'Không thể lấy thông tin người dùng';
      return {
        success: false,
        data: null as any,
        error: message,
        status: error.response?.status || 500,
      };
    }
  }

  /**
   * Tạo người dùng mới
   */
  async createUser(userData: CreateUserRequest): Promise<ApiResponse<User>> {
    try {
      const response = await backendInstance.post<{ data: User }>('/users', userData);
      
      return {
        success: true,
        data: response.data.data,
        message: 'Tạo người dùng mới thành công',
        status: response.status,
      };
    } catch (error: any) {
      console.error('Create user error:', error);
      
      const message = error.response?.data?.message || error.message || 'Tạo người dùng thất bại';
      return {
        success: false,
        data: null as any,
        error: message,
        status: error.response?.status || 500,
      };
    }
  }

  /**
   * Update user information
   */
  async updateUser(id: string, userData: UpdateUserRequest): Promise<ApiResponse<User>> {
    try {
      const response = await backendInstance.put<{ data: User }>(`/users/${id}`, userData);
      
      return {
        success: true,
        data: response.data.data,
        message: 'User information updated successfully',
        status: response.status,
      };
    } catch (error: any) {
      console.error('Update user error:', error);
      
      const message = error.response?.data?.message || error.message || 'Failed to update user information';
      return {
        success: false,
        data: null as any,
        error: message,
        status: error.response?.status || 500,
      };
    }
  }

  /**
   * Delete user (soft delete)
   */
  async deleteUser(id: string): Promise<ApiResponse<null>> {
    try {
      const response = await backendInstance.delete(`/users/${id}`);
      
      return {
        success: true,
        data: null,
        message: 'User deleted successfully',
        status: response.status,
      };
    } catch (error: any) {
      console.error('Delete user error:', error);
      
      const message = error.response?.data?.message || error.message || 'Failed to delete user';
      return {
        success: false,
        data: null,
        error: message,
        status: error.response?.status || 500,
      };
    }
  }

  /**
   * Khôi phục người dùng đã xóa
   */
  async restoreUser(id: string): Promise<ApiResponse<User>> {
    try {
      const response = await backendInstance.patch<{ data: User }>(`/users/${id}/restore`);
      
      return {
        success: true,
        data: response.data.data,
        message: 'Khôi phục người dùng thành công',
        status: response.status,
      };
    } catch (error: any) {
      console.error('Restore user error:', error);
      
      const message = error.response?.data?.message || error.message || 'Khôi phục người dùng thất bại';
      return {
        success: false,
        data: null as any,
        error: message,
        status: error.response?.status || 500,
      };
    }
  }

  /**
   * Thay đổi trạng thái người dùng (active/inactive)
   */
  async changeUserStatus(id: string, status: 'active' | 'inactive'): Promise<ApiResponse<User>> {
    try {
      const response = await backendInstance.patch<{ data: User }>(`/users/${id}/status`, { status });
      
      return {
        success: true,
        data: response.data.data,
        message: `Thay đổi trạng thái người dùng thành công`,
        status: response.status,
      };
    } catch (error: any) {
      console.error('Change user status error:', error);
      
      const message = error.response?.data?.message || error.message || 'Thay đổi trạng thái thất bại';
      return {
        success: false,
        data: null as any,
        error: message,
        status: error.response?.status || 500,
      };
    }
  }

  /**
   * Reset mật khẩu của người dùng (admin)
   */
  async resetUserPassword(id: string, newPassword: string): Promise<ApiResponse<null>> {
    try {
      const response = await backendInstance.patch(`/users/${id}/reset-password`, { 
        newPassword 
      });
      
      return {
        success: true,
        data: null,
        message: 'Reset mật khẩu thành công',
        status: response.status,
      };
    } catch (error: any) {
      console.error('Reset user password error:', error);
      
      const message = error.response?.data?.message || error.message || 'Reset mật khẩu thất bại';
      return {
        success: false,
        data: null,
        error: message,
        status: error.response?.status || 500,
      };
    }
  }

  /**
   * Search user by email
   */
  async searchUserByEmail(email: string): Promise<ApiResponse<User[]>> {
    try {
      const response = await backendInstance.get<{ data: User[] }>(`/users/search?email=${encodeURIComponent(email)}`);
      
      return {
        success: true,
        data: response.data.data,
        message: 'Search successful',
        status: response.status,
      };
    } catch (error: any) {
      console.error('Search user by email error:', error);
      
      const message = error.response?.data?.message || error.message || 'Search failed';
      return {
        success: false,
        data: null as any,
        error: message,
        status: error.response?.status || 500,
      };
    }
  }

  /**
   * Lấy thống kê người dùng
   */
  async getUserStats(): Promise<ApiResponse<{
    total: number;
    active: number;
    inactive: number;
    newThisMonth: number;
  }>> {
    try {
      const response = await backendInstance.get<{ data: {
        total: number;
        active: number;
        inactive: number;
        newThisMonth: number;
      } }>('/users/stats');
      
      return {
        success: true,
        data: response.data.data,
        message: 'Lấy thống kê thành công',
        status: response.status,
      };
    } catch (error: any) {
      console.error('Get user stats error:', error);
      
      const message = error.response?.data?.message || error.message || 'Không thể lấy thống kê';
      return {
        success: false,
        data: null as any,
        error: message,
        status: error.response?.status || 500,
      };
    }
  }

  /**
   * Upload avatar cho người dùng
   */
  async uploadAvatar(id: string, file: File): Promise<ApiResponse<{ avatarUrl: string }>> {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await backendInstance.post<{ data: { avatarUrl: string } }>(
        `/users/${id}/avatar`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      return {
        success: true,
        data: response.data.data,
        message: 'Upload avatar thành công',
        status: response.status,
      };
    } catch (error: any) {
      console.error('Upload avatar error:', error);
      
      const message = error.response?.data?.message || error.message || 'Upload avatar thất bại';
      return {
        success: false,
        data: null as any,
        error: message,
        status: error.response?.status || 500,
      };
    }
  }
}

// Export singleton instance
export const userService = new UserService();
