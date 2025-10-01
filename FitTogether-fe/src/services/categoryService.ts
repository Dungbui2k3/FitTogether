import { ApiResponse } from "../types";
import { Category } from "../types/category";
import { backendInstance } from "../utils/api";
import { CreateCategoryRequest, UpdateCategoryRequest } from "../types/category";

class CategoryService {
    async getCategories(): Promise<ApiResponse<Category[]>> {
        try {
            const response = await backendInstance.get<{ data: Category[] }>('/categories');
            return {
                success: true,
                data: response.data.data,
                message: 'Get categories success',
                status: response.status,
            };
        } catch (error: any) {
            console.error('Get categories error:', error);
            return {
                success: false,
                data: null as any,
                message: 'Get categories error',
                status: error.response?.status || 500,
            };
        }
    }

    async getCategoryById(id: string): Promise<ApiResponse<Category>> {
        try {
            const response = await backendInstance.get<{ data: Category }>(`/categories/${id}`);
            return {
                success: true,
                data: response.data.data,
                message: 'Get category success',
                status: response.status,
            };
        } catch (error: any) {
            console.error('Get category by id error:', error);
            return {
                success: false,
                data: null as any,
                message: 'Get category error',
                status: error.response?.status || 500,
            };
        }
    }

    async createCategory(categoryData: CreateCategoryRequest): Promise<ApiResponse<Category>> {
        try {
            const response = await backendInstance.post<{ data: Category }>('/categories', categoryData);
            return {
                success: true,
                data: response.data.data,
                message: 'Create category success',
                status: response.status,
            };
        } catch (error: any) {
            console.error('Create category error:', error);
            return {
                success: false,
                data: null as any,
                message: 'Create category error',
                status: error.response?.status || 500,
            };
        }
    }

    async updateCategory(id: string, categoryData: UpdateCategoryRequest): Promise<ApiResponse<Category>> {
        try {
            const response = await backendInstance.put<{ data: Category }>(`/categories/${id}`, categoryData);
            return {
                success: true,
                data: response.data.data,
                message: 'Update category success',
                status: response.status,
            };
        } catch (error: any) {
            console.error('Update category error:', error);
            return {
                success: false,
                data: null as any,
                message: 'Update category error',
                status: error.response?.status || 500,
            };
        }
    }

    async deleteCategory(id: string): Promise<ApiResponse<null>> {
        try {
            const response = await backendInstance.delete(`/categories/${id}`);
            return {
                success: true,
                data: null,
                message: 'Delete category success',
                status: response.status,
            };
        } catch (error: any) {
            console.error('Delete category error:', error);
            return {
                success: false,
                data: null as any,
                message: 'Delete category error',
                status: error.response?.status || 500,
            };
        }
    }

    async toggleCategoryStatus(id: string): Promise<ApiResponse<Category>> {
        try {
            const response = await backendInstance.patch<{ data: Category }>(`/categories/${id}/toggle-status`);
            return {
                success: true,
                data: response.data.data,
                message: 'Toggle category status success',
                status: response.status,
            };
        } catch (error: any) {
            console.error('Toggle category status error:', error);
            return {
                success: false,
                data: null as any,
                message: 'Toggle category status error',
                status: error.response?.status || 500,
            };
        }
    }

    async getCategoryStats(): Promise<ApiResponse<{
        total: number;
        active: number;
        inactive: number;
        productsCount: Record<string, number>;
    }>> {
        try {
            const response = await backendInstance.get<{ data: {
                total: number;
                active: number;
                inactive: number;
                productsCount: Record<string, number>;
            } }>('/categories/stats');
            return {
                success: true,
                data: response.data.data,
                message: 'Get category stats success',
                status: response.status,
            };
        } catch (error: any) {
            console.error('Get category stats error:', error);
            return {
                success: false,
                data: null as any,
                message: 'Get category stats error',
                status: error.response?.status || 500,
            };
        }
    }
}

export default new CategoryService();
export type { CreateCategoryRequest, UpdateCategoryRequest };
