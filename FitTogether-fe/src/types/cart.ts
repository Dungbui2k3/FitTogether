export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  version: 'digital' | 'physical';
  image?: string;
  currency: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export interface CartContextType {
  cart: Cart;
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: string, version: 'digital' | 'physical') => boolean;
}
