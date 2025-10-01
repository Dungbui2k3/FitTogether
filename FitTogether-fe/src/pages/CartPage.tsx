import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Package,
} from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useToast } from "../hooks";
import type { CartItem } from "../types/cart";

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart } = useCart();
  const { success } = useToast();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: currency,
    }).format(price);
  };

  const handleQuantityChange = (
    itemId: string,
    newQuantity: number,
    version: "digital" | "physical"
  ) => {
    if (newQuantity < 1) {
      return;
    } else if (version === "digital" && newQuantity > 1) {
      // Digital products can only have quantity 1
      success("Digital products can only have quantity 1");
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleRemoveItem = (itemId: string, itemName: string) => {
    removeFromCart(itemId);
    success(`${itemName} removed from cart`);
  };


  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          </div>

          {/* Empty Cart */}
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <ShoppingCart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet. Start
              shopping to fill it up!
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              Start Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <CartItemCard
                key={item.id}
                item={item}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemoveItem}
                formatPrice={formatPrice}
              />
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>

              {/* Items Count */}
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Items ({cart.itemCount})</span>
                <span className="font-medium">
                  {formatPrice(cart.total, cart.items[0]?.currency || "VND")}
                </span>
              </div>

              {/* Shipping */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {cart.items.some((item) => item.version === "physical") ? (
                    formatPrice(30000, cart.items[0]?.currency || "VND")
                  ) : (
                    <span className="text-green-600">Free</span>
                  )}
                </span>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 mb-6"></div>

              {/* Total */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-blue-600">
                  {formatPrice(
                    cart.total +
                      (cart.items.some((item) => item.version === "physical")
                        ? 30000
                        : 0),
                    cart.items[0]?.currency || "VND"
                  )}
                </span>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center space-x-2 mb-4"
              >
                <CreditCard className="h-5 w-5" />
                <span>Proceed to Checkout</span>
              </button>

              {/* Security Info */}
              <div className="text-center text-sm text-gray-500">
                <p className="flex items-center justify-center space-x-1">
                  <Package className="h-4 w-4" />
                  <span>Secure checkout</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface CartItemCardProps {
  item: CartItem;
  onQuantityChange: (
    itemId: string,
    quantity: number,
    version: "digital" | "physical"
  ) => void;
  onRemove: (itemId: string, itemName: string) => void;
  formatPrice: (price: number, currency: string) => string;
}

const CartItemCard: React.FC<CartItemCardProps> = ({
  item,
  onQuantityChange,
  onRemove,
  formatPrice,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-start space-x-4">
        {/* Product Image */}
        <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-xs">No Image</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {item.name}
          </h3>
          <div className="flex items-center space-x-4 mb-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 capitalize">
              {item.version} Version
            </span>
            <span className="text-sm text-gray-500">{item.currency}</span>
          </div>
          <p className="text-xl font-bold text-blue-600">
            {formatPrice(item.price, item.currency)}
          </p>
        </div>

        {/* Quantity and Actions */}
        <div className="flex flex-col items-end space-y-4">
          {/* Quantity Controls */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() =>
                onQuantityChange(item.id, item.quantity - 1, item.version)
              }
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-12 text-center text-lg font-medium">
              {item.quantity}
            </span>
            <button
              onClick={() =>
                onQuantityChange(item.id, item.quantity + 1, item.version)
              }
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                item.version === "digital"
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
              disabled={item.version === "digital"}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {/* Item Total */}
          <div className="flex justify-end items-center">
            <p className="text-lg text-gray-500">Total:</p>
            <p className="text-lg font-bold text-gray-900 ml-2">
              {formatPrice(item.price * item.quantity, item.currency)}
            </p>
          </div>

          {/* Remove Button */}
          <button
            onClick={() => onRemove(item.id, item.name)}
            className="flex items-center space-x-1 text-red-500 hover:text-red-700 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            <span className="text-sm font-medium">Remove</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
