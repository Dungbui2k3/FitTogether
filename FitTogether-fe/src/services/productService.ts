import { backendInstance } from '../utils/api';
import type { ApiResponse } from '../types/auth';
import type { Product, ProductFilter, ProductListParams, ProductListResponse, CreateProductRequest, UpdateProductRequest } from '../types/product';

class ProductService {
  /**
   * Lấy danh sách sản phẩm
   */
  async getProducts(params: ProductListParams = {}): Promise<ApiResponse<ProductListResponse>> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.search) queryParams.append('search', params.search);
      if (params.category) queryParams.append('category', params.category);
      if (params.priceMin !== undefined) queryParams.append('priceMin', params.priceMin.toString());
      if (params.priceMax !== undefined) queryParams.append('priceMax', params.priceMax.toString());
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
      if (params.featured !== undefined) queryParams.append('featured', params.featured.toString());
      if (params.inStock !== undefined) queryParams.append('inStock', params.inStock.toString());
      if (params.difficulty) queryParams.append('difficulty', params.difficulty);

      const response = await backendInstance.get<{ data: ProductListResponse }>(
        `/products?${queryParams.toString()}`
      );
      
      return {
        success: true,
        data: response.data.data,
        message: 'Lấy danh sách sản phẩm thành công',
        status: response.status,
      };
    } catch (error: any) {
      console.error('Get products error:', error);
      
      const message = error.response?.data?.message || error.message || 'Không thể lấy danh sách sản phẩm';
      return {
        success: false,
        data: null as any,
        error: message,
        status: error.response?.status || 500,
      };
    }
  }

  /**
   * Lấy thông tin chi tiết một sản phẩm
   */
  async getProductById(id: string | number): Promise<ApiResponse<Product>> {
    try {
      const response = await backendInstance.get<{ data: Product }>(`/products/${id}`);
      
      return {
        success: true,
        data: response.data.data,
        message: 'Lấy thông tin sản phẩm thành công',
        status: response.status,
      };
    } catch (error: any) {
      console.error('Get product by id error:', error);
      
      const message = error.response?.data?.message || error.message || 'Không thể lấy thông tin sản phẩm';
      return {
        success: false,
        data: null as any,
        error: message,
        status: error.response?.status || 500,
      };
    }
  }

  /**
   * Tạo sản phẩm mới (Admin only)
   */
  async createProduct(productData: FormData): Promise<ApiResponse<Product>> {
    try {
      const response = await backendInstance.post<{ data: Product }>(
        '/products',
        productData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      return {
        success: true,
        data: response.data.data,
        message: 'Tạo sản phẩm mới thành công',
        status: response.status,
      };
    } catch (error: any) {
      console.error('Create product error:', error);
  
      const message =
        error.response?.data?.message ||
        error.message ||
        'Tạo sản phẩm thất bại';
  
      return {
        success: false,
        data: null as any,
        error: message,
        status: error.response?.status || 500,
      };
    }
  }
  

  /**
   * Cập nhật thông tin sản phẩm (Admin only)
   */
  async updateProduct(id: string | number, productData: UpdateProductRequest | FormData): Promise<ApiResponse<Product>> {
    try {
      const response = await backendInstance.put<{ data: Product }>(`/products/${id}`, productData, {
        headers: productData instanceof FormData ? {
          'Content-Type': 'multipart/form-data',
        } : {
          'Content-Type': 'application/json',
        },
      });
      
      return {
        success: true,
        data: response.data.data,
        message: 'Cập nhật sản phẩm thành công',
        status: response.status,
      };
    } catch (error: any) {
      console.error('Update product error:', error);
      
      const message = error.response?.data?.message || error.message || 'Cập nhật sản phẩm thất bại';
      return {
        success: false,
        data: null as any,
        error: message,
        status: error.response?.status || 500,
      };
    }
  }

  /**
   * Xóa sản phẩm (Admin only)
   */
  async deleteProduct(id: string | number): Promise<ApiResponse<null>> {
    try {
      const response = await backendInstance.delete(`/products/${id}`);
      
      return {
        success: true,
        data: null,
        message: 'Xóa sản phẩm thành công',
        status: response.status,
      };
    } catch (error: any) {
      console.error('Delete product error:', error);
      
      const message = error.response?.data?.message || error.message || 'Xóa sản phẩm thất bại';
      return {
        success: false,
        data: null,
        error: message,
        status: error.response?.status || 500,
      };
    }
  }

  /**
   * Lấy danh sách sản phẩm nổi bật
   */
  async getFeaturedProducts(limit: number = 6): Promise<ApiResponse<Product[]>> {
    try {
      const response = await backendInstance.get<{ data: Product[] }>(`/products/featured?limit=${limit}`);
      
      return {
        success: true,
        data: response.data.data,
        message: 'Lấy sản phẩm nổi bật thành công',
        status: response.status,
      };
    } catch (error: any) {
      console.error('Get featured products error:', error);
      
      const message = error.response?.data?.message || error.message || 'Không thể lấy sản phẩm nổi bật';
      return {
        success: false,
        data: null as any,
        error: message,
        status: error.response?.status || 500,
      };
    }
  }

  /**
   * Lấy sản phẩm theo danh mục
   */
  async getProductsByCategory(category: string, limit?: number): Promise<ApiResponse<Product[]>> {
    try {
      const queryParams = new URLSearchParams({ category });
      if (limit) queryParams.append('limit', limit.toString());

      const response = await backendInstance.get<{ data: Product[] }>(`/products/category?${queryParams.toString()}`);
      
      return {
        success: true,
        data: response.data.data,
        message: 'Lấy sản phẩm theo danh mục thành công',
        status: response.status,
      };
    } catch (error: any) {
      console.error('Get products by category error:', error);
      
      const message = error.response?.data?.message || error.message || 'Không thể lấy sản phẩm theo danh mục';
      return {
        success: false,
        data: null as any,
        error: message,
        status: error.response?.status || 500,
      };
    }
  }

  /**
   * Tìm kiếm sản phẩm
   */
  async searchProducts(query: string, filters: ProductFilter = {}): Promise<ApiResponse<ProductListResponse>> {
    try {
      const searchParams = { ...filters, search: query };
      return await this.getProducts(searchParams);
    } catch (error: any) {
      console.error('Search products error:', error);
      
      const message = error.response?.data?.message || error.message || 'Tìm kiếm sản phẩm thất bại';
      return {
        success: false,
        data: null as any,
        error: message,
        status: error.response?.status || 500,
      };
    }
  }

  /**
   * Thay đổi trạng thái nổi bật của sản phẩm (Admin only)
   */
  async toggleFeatured(id: string | number): Promise<ApiResponse<Product>> {
    try {
      const response = await backendInstance.patch<{ data: Product }>(`/products/${id}/featured`);
      
      return {
        success: true,
        data: response.data.data,
        message: 'Thay đổi trạng thái nổi bật thành công',
        status: response.status,
      };
    } catch (error: any) {
      console.error('Toggle featured error:', error);
      
      const message = error.response?.data?.message || error.message || 'Thay đổi trạng thái nổi bật thất bại';
      return {
        success: false,
        data: null as any,
        error: message,
        status: error.response?.status || 500,
      };
    }
  }

  /**
   * Thay đổi trạng thái kho của sản phẩm (Admin only)
   */
  async updateStock(id: string | number, inStock: boolean): Promise<ApiResponse<Product>> {
    try {
      const response = await backendInstance.patch<{ data: Product }>(`/products/${id}/stock`, { inStock });
      
      return {
        success: true,
        data: response.data.data,
        message: 'Cập nhật trạng thái kho thành công',
        status: response.status,
      };
    } catch (error: any) {
      console.error('Update stock error:', error);
      
      const message = error.response?.data?.message || error.message || 'Cập nhật trạng thái kho thất bại';
      return {
        success: false,
        data: null as any,
        error: message,
        status: error.response?.status || 500,
      };
    }
  }

  /**
   * Upload hình ảnh sản phẩm (Admin only)
   */
  async uploadProductImage(id: string | number, file: File): Promise<ApiResponse<{ imageUrl: string }>> {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await backendInstance.post<{ data: { imageUrl: string } }>(
        `/products/${id}/image`,
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
        message: 'Upload hình ảnh thành công',
        status: response.status,
      };
    } catch (error: any) {
      console.error('Upload product image error:', error);
      
      const message = error.response?.data?.message || error.message || 'Upload hình ảnh thất bại';
      return {
        success: false,
        data: null as any,
        error: message,
        status: error.response?.status || 500,
      };
    }
  }

  /**
   * Lấy danh sách danh mục sản phẩm
   */
  async getCategories(): Promise<ApiResponse<string[]>> {
    try {
      const response = await backendInstance.get<{ data: string[] }>('/products/categories');
      
      return {
        success: true,
        data: response.data.data,
        message: 'Lấy danh sách danh mục thành công',
        status: response.status,
      };
    } catch (error: any) {
      console.error('Get categories error:', error);
      
      const message = error.response?.data?.message || error.message || 'Không thể lấy danh sách danh mục';
      return {
        success: false,
        data: null as any,
        error: message,
        status: error.response?.status || 500,
      };
    }
  }

  /**
   * Lấy thống kê sản phẩm (Admin only)
   */
  async getProductStats(): Promise<ApiResponse<{
    total: number;
    featured: number;
    inStock: number;
    outOfStock: number;
    categories: Record<string, number>;
  }>> {
    try {
      const response = await backendInstance.get<{ data: {
        total: number;
        featured: number;
        inStock: number;
        outOfStock: number;
        categories: Record<string, number>;
      } }>('/products/stats');
      
      return {
        success: true,
        data: response.data.data,
        message: 'Lấy thống kê sản phẩm thành công',
        status: response.status,
      };
    } catch (error: any) {
      console.error('Get product stats error:', error);
      
      const message = error.response?.data?.message || error.message || 'Không thể lấy thống kê sản phẩm';
      return {
        success: false,
        data: null as any,
        error: message,
        status: error.response?.status || 500,
      };
    }
  }

  /**
   * Cập nhật đánh giá sản phẩm
   */
  async updateRating(id: string | number, rating: number): Promise<ApiResponse<Product>> {
    try {
      const response = await backendInstance.patch<{ data: Product }>(`/products/${id}/rating`, { rating });
      
      return {
        success: true,
        data: response.data.data,
        message: 'Cập nhật đánh giá thành công',
        status: response.status,
      };
    } catch (error: any) {
      console.error('Update rating error:', error);
      
      const message = error.response?.data?.message || error.message || 'Cập nhật đánh giá thất bại';
      return {
        success: false,
        data: null as any,
        error: message,
        status: error.response?.status || 500,
      };
    }
  }

  /**
   * Sao chép sản phẩm (Admin only)
   */
  async duplicateProduct(id: string | number): Promise<ApiResponse<Product>> {
    try {
      const response = await backendInstance.post<{ data: Product }>(`/products/${id}/duplicate`);
      
      return {
        success: true,
        data: response.data.data,
        message: 'Sao chép sản phẩm thành công',
        status: response.status,
      };
    } catch (error: any) {
      console.error('Duplicate product error:', error);
      
      const message = error.response?.data?.message || error.message || 'Sao chép sản phẩm thất bại';
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
export const productService = new ProductService();

// Export types for use in components
export type { 
  ProductListResponse, 
  CreateProductRequest, 
  UpdateProductRequest, 
  ProductListParams 
};