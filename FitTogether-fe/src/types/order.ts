export type ProductType = 'physical'; // All sports accessories are physical products

export interface OrderItemDto {
  productId: string;
  type: ProductType;
  quantity: number;
}

export interface OrderItem {
  _id: string;
  productId: {
    _id: string;
    name: string;
    price: number;
    urlImgs: string[]
  };
  quantity: number;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  _id: string;
  items: OrderItem[];
  orderCode: string;
  status: 'pending' | 'success' | 'cancel';
  totalAmount: number;
  paymentMethod?: 'payos' | 'cod';
  orderDate: string;
  notes?: string;
  phone?: string;
  address?: string;
  userId?: {
    name?: string;
    email?: string;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CreateOrderRequest {
  items: OrderItemDto[];
  paymentMethod: 'payos' | 'cod';
  notes?: string;
  address: string;
}

export interface PayOSPayment {
  checkoutUrl: string;
  qrCode: string;
  paymentId: string;
  orderCode: number;
  amount: number;
  formattedAmount: string;
  expiresAt: string;
}

export interface CreateOrderResponse {
  id: string;
  orderCode: string;
  items: OrderItem[];
  status: 'pending' | 'success' | 'cancel';
  totalAmount: number;
  paymentMethod: 'payos' | 'cod';
  orderDate: string;
  createdAt: string;
  payment?: PayOSPayment;
  // Fallback for different response structures
  checkoutUrl?: string;
}

export interface OrderTrackingInfo {
  status: string;
  updatedAt: string;
  location?: string;
  estimatedDelivery?: string;
}

export interface RefundRequest {
  reason: string;
}