import {
  CreateSubFieldRequest,
  SubFieldListResponse,
} from "./../types/subField";
import { ApiResponse } from "../types";
import { backendInstance } from "../utils/api";

class SubFieldService {
  async getSubFields(): Promise<ApiResponse<SubFieldListResponse[]>> {
    try {
      const response = await backendInstance.get<{
        data: SubFieldListResponse[];
      }>("/subFields");
      return {
        success: true,
        data: response.data.data,
        message: "Get subFields success",
        status: response.status,
      };
    } catch (error: any) {
      console.error("Get subFields error:", error);
      return {
        success: false,
        data: null as any,
        message: "Get subFields error",
        status: error.response?.status || 500,
      };
    }
  }

  async getSubFieldsByFieldId(
    fieldId: string
  ): Promise<ApiResponse<any>> {
    try {
      const response = await backendInstance.get<{ data: any }>(
        `/subFields/field/${fieldId}`
      );

      return {
        success: true,
        data: response.data.data,
        message: "Get subFields success",
        status: response.status,
      };
    } catch (error: any) {
      console.error("Get subFields by id error:", error);
      return {
        success: false,
        data: null as any,
        message: "Get subFields error",
        status: error.response?.status || 500,
      };
    }
  }

  // async createsubFields(subFieldsData: CreateCategoryRequest): Promise<ApiResponse<Category>> {
  //     try {
  //         const response = await backendInstance.post<{ data: Category }>('/subFields', categoryData);
  //         return {
  //             success: true,
  //             data: response.data.data,
  //             message: 'Create category success',
  //             status: response.status,
  //         };
  //     } catch (error: any) {
  //         console.error('Create category error:', error);
  //         return {
  //             success: false,
  //             data: null as any,
  //             message: 'Create category error',
  //             status: error.response?.status || 500,
  //         };
  //     }
  // }

  // async updateCategory(id: string, categoryData: UpdateCategoryRequest): Promise<ApiResponse<Category>> {
  //     try {
  //         const response = await backendInstance.put<{ data: Category }>(`/subFields/${id}`, categoryData);
  //         return {
  //             success: true,
  //             data: response.data.data,
  //             message: 'Update category success',
  //             status: response.status,
  //         };
  //     } catch (error: any) {
  //         console.error('Update category error:', error);
  //         return {
  //             success: false,
  //             data: null as any,
  //             message: 'Update category error',
  //             status: error.response?.status || 500,
  //         };
  //     }
  // }

  // async deleteCategory(id: string): Promise<ApiResponse<null>> {
  //     try {
  //         const response = await backendInstance.delete(`/subFields/${id}`);
  //         return {
  //             success: true,
  //             data: null,
  //             message: 'Delete category success',
  //             status: response.status,
  //         };
  //     } catch (error: any) {
  //         console.error('Delete category error:', error);
  //         return {
  //             success: false,
  //             data: null as any,
  //             message: 'Delete category error',
  //             status: error.response?.status || 500,
  //         };
  //     }
  // }

  // async toggleCategoryStatus(id: string): Promise<ApiResponse<Category>> {
  //     try {
  //         const response = await backendInstance.patch<{ data: Category }>(`/subFields/${id}/toggle-status`);
  //         return {
  //             success: true,
  //             data: response.data.data,
  //             message: 'Toggle category status success',
  //             status: response.status,
  //         };
  //     } catch (error: any) {
  //         console.error('Toggle category status error:', error);
  //         return {
  //             success: false,
  //             data: null as any,
  //             message: 'Toggle category status error',
  //             status: error.response?.status || 500,
  //         };
  //     }
  // }
}

export const subFieldService = new SubFieldService();
export default subFieldService;
export type { CreateSubFieldRequest };
