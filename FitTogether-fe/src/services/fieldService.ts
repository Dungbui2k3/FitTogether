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
  async createField(fieldData: CreateFieldRequest | FormData): Promise<ApiResponse<Field>> {
    try {
      const config = fieldData instanceof FormData 
        ? { headers: { 'Content-Type': 'multipart/form-data' } }
        : {};
        
      const response = await backendInstance.post<{ data: Field }>('/fields', fieldData, config);
      
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
  async updateField(id: string, fieldData: UpdateFieldRequest | FormData): Promise<ApiResponse<Field>> {
    try {
      const config = fieldData instanceof FormData 
        ? { headers: { 'Content-Type': 'multipart/form-data' } }
        : {};
        
      const response = await backendInstance.put<{ data: Field }>(`/fields/${id}`, fieldData, config);
      
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

  /**
   * Khôi phục sân thể thao đã xóa
   */
  async restoreField(id: string): Promise<ApiResponse<Field>> {
    try {
      const response = await backendInstance.patch<{ data: Field }>(`/fields/${id}/restore`);
      
      return {
        success: true,
        data: response.data.data,
        message: 'Khôi phục sân thể thao thành công',
        status: response.status,
      };
    } catch (error: any) {
      console.error('Restore field error:', error);
      
      const message = error.response?.data?.message || error.message || 'Không thể khôi phục sân thể thao';
      return {
        success: false,
        data: null as any,
        error: message,
        status: error.response?.status || 500,
      };
    }
  }

  /**
   * Xóa vĩnh viễn sân thể thao
   */
  async permanentDeleteField(id: string): Promise<ApiResponse<null>> {
    try {
      const response = await backendInstance.delete(`/fields/${id}/permanent`);
      
      return {
        success: true,
        data: null,
        message: 'Xóa vĩnh viễn sân thể thao thành công',
        status: response.status,
      };
    } catch (error: any) {
      console.error('Permanent delete field error:', error);
      
      const message = error.response?.data?.message || error.message || 'Không thể xóa vĩnh viễn sân thể thao';
      return {
        success: false,
        data: null,
        error: message,
        status: error.response?.status || 500,
      };
    }
  }

  /**
   * Tìm kiếm sân thể thao
   */
  async searchFields(query: string): Promise<ApiResponse<Field[]>> {
    try {
      const response = await backendInstance.get<{ data: Field[] }>(`/fields/search?q=${encodeURIComponent(query)}`);
      
      return {
        success: true,
        data: response.data.data,
        message: 'Tìm kiếm sân thể thao thành công',
        status: response.status,
      };
    } catch (error: any) {
      console.error('Search fields error:', error);
      
      const message = error.response?.data?.message || error.message || 'Không thể tìm kiếm sân thể thao';
      return {
        success: false,
        data: null as any,
        error: message,
        status: error.response?.status || 500,
      };
    }
  }

  /**
   * Lấy sân thể thao theo vị trí
   */
  async getFieldsByLocation(location: string): Promise<ApiResponse<Field[]>> {
    try {
      const response = await backendInstance.get<{ data: Field[] }>(`/fields/location?address=${encodeURIComponent(location)}`);
      
      return {
        success: true,
        data: response.data.data,
        message: 'Lấy sân thể thao theo vị trí thành công',
        status: response.status,
      };
    } catch (error: any) {
      console.error('Get fields by location error:', error);
      
      const message = error.response?.data?.message || error.message || 'Không thể lấy sân thể thao theo vị trí';
      return {
        success: false,
        data: null as any,
        error: message,
        status: error.response?.status || 500,
      };
    }
  }

  /**
   * Lấy thống kê sân thể thao
   */
  async getFieldStats(): Promise<ApiResponse<{
    total: number;
    active: number;
    deleted: number;
    byLocation: { [key: string]: number };
  }>> {
    try {
      const response = await backendInstance.get<{ data: any }>('/fields/stats');
      
      return {
        success: true,
        data: response.data.data,
        message: 'Lấy thống kê sân thể thao thành công',
        status: response.status,
      };
    } catch (error: any) {
      console.error('Get field stats error:', error);
      
      const message = error.response?.data?.message || error.message || 'Không thể lấy thống kê sân thể thao';
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
export const fieldService = new FieldService();
export default fieldService;
