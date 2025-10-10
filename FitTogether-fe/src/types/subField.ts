// SubFields interface — phản ánh dữ liệu SubField trong MongoDB
export interface SubField {
  _id: string;
  name: string;
  type?: string;
  pricePerHour: number;
  status?: "available" | "maintenance" | "booked";
  fieldId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubFieldRequest {
  name: string;
  type?: string;
  pricePerHour: number;
  status?: "available" | "maintenance" | "booked";
}

export interface EditSubFieldRequest {
  name: string;
  type?: string;
  pricePerHour: number;
  status?: "available" | "maintenance" | "booked";
}

// Response khi trả về danh sách SubField
export interface SubFieldListResponse {
  subFields: SubField[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
export interface BookingRequest {
  day: string;
  duration: string;
  totalPrice: number;
}
