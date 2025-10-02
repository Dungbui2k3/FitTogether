import { ApiResponse } from '../types';
import { CreateOrderRequest, Order, OrderItemDto, CreateOrderResponse } from '../types/order';
import { backendInstance } from '../utils/api';

class OrderService {
  /**
   * Create a new order
   */
  async createOrder(orderData: CreateOrderRequest): Promise<ApiResponse<CreateOrderResponse>> {
    try {
      const response = await backendInstance.post<{ data: CreateOrderResponse }>('/orders', orderData);
      return {
        success: true,
        data: response.data.data,
        message: 'Create order success',
        status: response.status,
      };
    } catch (error: any) {
      console.error('Create order error:', error);
      return {
        success: false,
        data: null as any,
        message: error.response?.data?.message || 'Create order error',
        status: error.response?.status || 500,
      };
    }
  }

  /**
   * Get order by ID
   */
  async getOrderById(orderId: string): Promise<ApiResponse<Order>> {
    try {
      const response = await backendInstance.get<{ data: Order }>(`/orders/${orderId}`);
      return {
        success: true,
        data: response.data.data,
        message: 'Get order success',
        status: response.status,
      };
    } catch (error: any) {
      console.error('Get order error:', error);
      return {
        success: false,
        data: null as any,
        message: error.response?.data?.message || 'Get order error',
        status: error.response?.status || 500,
      };
    }
  }

  /**
   * Get user's orders
   */
  async getUserOrders(page: number = 1, limit: number = 10): Promise<ApiResponse<{ orders: Order[]; total: number; page: number; limit: number }>> {
    try {
      const response = await backendInstance.get<{ data: { orders: Order[]; total: number; page: number; limit: number } }>(`/orders?page=${page}&limit=${limit}`);
      return {
        success: true,
        data: response.data.data,
        message: 'Get user orders success',
        status: response.status,
      };
    } catch (error: any) {
      console.error('Get user orders error:', error);
      return {
        success: false,
        data: null as any,
        message: error.response?.data?.message || 'Get user orders error',
        status: error.response?.status || 500,
      };
    }
  }

  /**
   * Get all orders (admin only)
   */
  async findAllOrders(page: number = 1, limit: number = 10, status?: string): Promise<ApiResponse<{ orders: Order[]; total: number; page: number; limit: number }>> {
    try {
      let url = `/orders?page=${page}&limit=${limit}`;
      if (status) {
        url += `&status=${status}`;
      }
      
      const response = await backendInstance.get<{ 
        data: { 
          orders: Order[]; 
          pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
            hasNextPage: boolean;
            hasPrevPage: boolean;
          }
        } 
      }>(url);
      
      return {
        success: true,
        data: {
          orders: response.data.data.orders,
          total: response.data.data.pagination.total,
          page: response.data.data.pagination.page,
          limit: response.data.data.pagination.limit,
        },
        message: 'Get all orders success',
        status: response.status,
      };
    } catch (error: any) {
      console.error('Get all orders error:', error);
      return {
        success: false,
        data: null as any,
        message: error.response?.data?.message || 'Get all orders error',
        status: error.response?.status || 500,
      };
    }
  }

  /**
   * Get orders by user ID
   */
  async getOrdersByUserId(userId: string): Promise<ApiResponse<any>> {
    try {
      const response = await backendInstance.get<{ data: Order[] }>(`/orders/user/${userId}`);
      return {
        success: true,
        data: response.data.data || [],
        message: 'Get orders by user ID success',
        status: response.status,
      };
    } catch (error: any) {
      console.error('Get orders by user ID error:', error);
      
      // Fallback: try to get all orders and filter by userId
      try {
        const fallbackResponse = await backendInstance.get<{ data: Order[] }>('/orders');
        const userOrders = (fallbackResponse.data.data || []).filter(order => order.userId._id === userId);
        
        return {
          success: true,
          data: userOrders,
          message: 'Orders retrieved successfully (fallback)',
          status: fallbackResponse.status,
        };
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
        return {
          success: false,
          data: [],
          message: error.response?.data?.message || 'Get orders by user ID error',
          status: error.response?.status || 500,
        };
      }
    }
  }

  /**
   * Update order status (admin only)
   */
  async updateOrderStatus(orderId: string, status: 'pending' | 'success' | 'cancel'): Promise<ApiResponse<Order>> {
    try {
      const response = await backendInstance.patch<{ data: Order }>(`/orders/${orderId}/status`, { status });
      return {
        success: true,
        data: response.data.data,
        message: 'Update order status success',
        status: response.status,
      };
    } catch (error: any) {
      console.error('Update order status error:', error);
      return {
        success: false,
        data: null as any,
        message: error.response?.data?.message || 'Update order status error',
        status: error.response?.status || 500,
      };
    }
  }

  /**
   * Cancel order
   */
  async cancelOrder(orderId: string): Promise<ApiResponse<Order>> {
    try {
      const response = await backendInstance.patch<{ data: Order }>(`/orders/${orderId}/cancel`);
      return {
        success: true,
        data: response.data.data,
        message: 'Cancel order success',
        status: response.status,
      };
    } catch (error: any) {
      console.error('Cancel order error:', error);
      return {
        success: false,
        data: null as any,
        message: error.response?.data?.message || 'Cancel order error',
        status: error.response?.status || 500,
      };
    }
  }

  /**
   * Convert cart items to order items DTO
   */
  convertCartItemsToOrderItems(cartItems: Array<{
    productId: string;
    quantity: number;
  }>): OrderItemDto[] {
    return cartItems.map(item => ({
      productId: item.productId,
      type: 'physical' as 'digital' | 'physical', // All sports accessories are physical
      quantity: item.quantity,
    }));
  }

  /**
   * Verify payment status from PayOS callback
   */
  async verifyPaymentStatus(params: {
    code: string;
    id: string;
    orderCode: string;
    status: string;
  }): Promise<ApiResponse<Order>> {
    try {
      const response = await backendInstance.post<{ data: Order }>('/orders/verify-payment', params);
      return {
        success: true,
        data: response.data.data,
        message: 'Payment verification successful',
        status: response.status,
      };
    } catch (error: any) {
      console.error('Payment verification error:', error);
      return {
        success: false,
        data: null as any,
        message: error.response?.data?.message || 'Payment verification failed',
        status: error.response?.status || 500,
      };
    }
  }

}

export default new OrderService();
