import { backendInstance } from '../utils/api';
import type { ApiResponse } from '../types/auth';
import type { 
  Field, 
  FieldListParams, 
  FieldListResponse, 
  CreateFieldRequest, 
  UpdateFieldRequest 
} from '../types/field';

class FieldService {
  /**
   * Lấy danh sách sân thể thao
   */
  async getFields(params: FieldListParams = {}): Promise<ApiResponse<FieldListResponse>> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.search) queryParams.append('search', params.search);
      if (params.isDeleted !== undefined) queryParams.append('isDeleted', params.isDeleted.toString());
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

      const response = await backendInstance.get<{ data: FieldListResponse }>(
        `/fields?${queryParams.toString()}`
      );
      
      return {
        success: true,
        data: response.data.data,
        message: 'Lấy danh sách sân thể thao thành công',
        status: response.status,
      };
    } catch (error: any) {
      console.error('Get fields error:', error);
      
      const message = error.response?.data?.message || error.message || 'Không thể lấy danh sách sân thể thao';
      return {
        success: false,
        data: null as any,
        error: message,
        status: error.response?.status || 500,
      };
    }
  }

  /**
   * Lấy thông tin chi tiết một sân thể thao
   */
  async getFieldById(id: string): Promise<ApiResponse<Field>> {
    try {
      const response = await backendInstance.get<{ data: Field }>(`/fields/${id}`);
      
      return {
        success: true,
        data: response.data.data,
        message: 'Lấy thông tin sân thể thao thành công',
        status: response.status,
      };
    } catch (error: any) {
      console.error('Get field by ID error:', error);
      
      const message = error.response?.data?.message || error.message || 'Không thể lấy thông tin sân thể thao';
      return {
        success: false,
        data: null as any,
        error: message,
        status: error.response?.status || 500,
      };
    }
  }

  /**
   * Tạo sân thể thao mới
   */
  async createField(fieldData: CreateFieldRequest): Promise<ApiResponse<Field>> {
    try {
      const response = await backendInstance.post<{ data: Field }>('/fields', fieldData);
      
      return {
        success: true,
        data: response.data.data,
        message: 'Tạo sân thể thao thành công',
        status: response.status,
      };
    } catch (error: any) {
      console.error('Create field error:', error);
      
      const message = error.response?.data?.message || error.message || 'Không thể tạo sân thể thao';
      return {
        success: false,
        data: null as any,
        error: message,
        status: error.response?.status || 500,
      };
    }
  }

  /**
   * Cập nhật thông tin sân thể thao
   */
  async updateField(id: string, fieldData: UpdateFieldRequest): Promise<ApiResponse<Field>> {
    try {
      const response = await backendInstance.put<{ data: Field }>(`/fields/${id}`, fieldData);
      
      return {
        success: true,
        data: response.data.data,
        message: 'Cập nhật sân thể thao thành công',
        status: response.status,
      };
    } catch (error: any) {
      console.error('Update field error:', error);
      
      const message = error.response?.data?.message || error.message || 'Không thể cập nhật sân thể thao';
      return {
        success: false,
        data: null as any,
        error: message,
        status: error.response?.status || 500,
      };
    }
  }

  /**
   * Xóa sân thể thao (soft delete)
   */
  async deleteField(id: string): Promise<ApiResponse<null>> {
    try {
      const response = await backendInstance.delete(`/fields/${id}`);
      
      return {
        success: true,
        data: null,
        message: 'Xóa sân thể thao thành công',
        status: response.status,
      };
    } catch (error: any) {
      console.error('Delete field error:', error);
      
      const message = error.response?.data?.message || error.message || 'Không thể xóa sân thể thao';
      return {
        success: false,
        data: null,
        error: message,
        status: error.response?.status || 500,
      };
    }
  }




}

// Export singleton instance
export const fieldService = new FieldService();
export default fieldService;
