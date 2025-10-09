import { ApiResponse } from "../types";
import { BookingRequest } from "../types/subField";
import { backendInstance } from "../utils/api";

class BookingService {
  async getBookings(
    subFieldId: string,
    day: string
  ): Promise<ApiResponse<any>> {
    try {
      const response = await backendInstance.get<{ data: any }>(
        `/booking/${subFieldId}/${day}`
      );

      console.log("Get subFields by id response:", response.data);
      return {
        success: true,
        data: response.data.data.data,
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

  async booking(
    subFieldId: string,
    bookingRequest: BookingRequest
  ): Promise<ApiResponse<any>> {
    try {
      const response = await backendInstance.post<{ data: any }>(
        `/booking/${subFieldId}`,
        bookingRequest
      );
      return {
        success: true,
        data: response.data.data,
        message: "Create category success",
        status: response.status,
      };
    } catch (error: any) {
      console.error("Create category error:", error);
      return {
        success: false,
        data: null as any,
        message: "Create category error",
        status: error.response?.status || 500,
      };
    }
  }

  async getBookingsByUserId(userId: string): Promise<ApiResponse<any>> {
    try {
      const response = await backendInstance.get<{ data: any }>(
        `/booking/history-booking/${userId}`
      );

      console.log("Get subFields by id response:", response.data);
      return {
        success: true,
        data: response.data.data.data,
        message: "Get subFields success",
        status: response.status,
      };
    } catch (error: any) {
      console.error("Update category error:", error);
      return {
        success: false,
        data: null as any,
        message: "Update category error",
        status: error.response?.status || 500,
      };
    }
  }

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

export const bookingService = new BookingService();
export default bookingService;
