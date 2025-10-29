import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Package,
  Ticket,
} from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useAuth, useToast } from "../hooks";
import { productService } from "../services/productService";
import type { CartItem } from "../types/cart";
import type { Product } from "../types/product";

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart } = useCart();
  const { user } = useAuth();
  const [profileData, setProfileData] = useState({
    points: 0,
    pointsUsed: 0,
  });

  const { success, error: showError } = useToast();
  const [productData, setProductData] = useState<{ [key: string]: Product }>(
    {}
  );
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (user) {
      console.log("Profile:", user);
      setProfileData({
        points: user.points || 0,
        pointsUsed: 0,
      });
    }
  }, [user]);

  // Fetch product data for stock validation
  useEffect(() => {
    const fetchProductData = async () => {
      if (cart.items.length === 0) return;

      setLoadingProducts(true);
      const productMap: { [key: string]: Product } = {};

      try {
        await Promise.all(
          cart.items.map(async (item) => {
            if (!productData[item.productId]) {
              const response = await productService.getProductById(
                item.productId
              );
              if (response.success && response.data) {
                productMap[item.productId] = response.data;
              }
            }
          })
        );

        setProductData((prev) => ({ ...prev, ...productMap }));
      } catch (error) {
        console.error("Error fetching product data:", error);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProductData();
  }, [cart.items]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleQuantityChange = (
    itemId: string,
    newQuantity: number,
    productId: string,
    productName: string
  ) => {
    if (newQuantity < 1) {
      return;
    }

    const product = productData[productId];
    if (product && newQuantity > product.quantity) {
      showError(
        `Số lượng không thể vượt quá ${product.quantity} sản phẩm có sẵn cho ${productName}`
      );
      return;
    }

    updateQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = (itemId: string, itemName: string) => {
    removeFromCart(itemId);
    success(`${itemName} đã được xóa khỏi giỏ hàng`);
  };

  const handleUpdateQuantityVoucher = (newValue: number) => {
    if (newValue < 0 || newValue > profileData.points) return;
    setProfileData((prev) => ({ ...prev, pointsUsed: newValue }));
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Giỏ Hàng</h1>
          </div>

          {/* Empty Cart */}
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <ShoppingCart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Giỏ hàng của bạn đang trống
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Có vẻ như bạn chưa thêm sản phẩm nào vào giỏ hàng. Hãy bắt đầu mua
              sắm ngay!
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              Bắt Đầu Mua Sắm
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
            <h1 className="text-3xl font-bold text-gray-900">Giỏ Hàng</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <CartItemCard
                key={item.id}
                item={item}
                product={productData[item.productId]}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemoveItem}
                formatPrice={formatPrice}
                loadingProducts={loadingProducts}
              />
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Tóm Tắt Đơn Hàng
              </h2>

              {/* Tạm tính */}
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-600">Tạm tính</span>
                <span className="font-medium text-gray-800">
                  {formatPrice(cart.total)}
                </span>
              </div>

              {/* Phí vận chuyển */}
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-600">Phí vận chuyển</span>
                <span className="font-medium text-gray-800">
                  {cart.items.length > 0 ? formatPrice(0) : "Miễn phí"}
                </span>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 my-4"></div>

              {/* 🎁 Voucher / Điểm thưởng */}
              <div className="mb-5">
                <h3 className="text-md font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                  <Ticket className="h-5 w-5 text-blue-600" />
                  <span>Voucher</span>
                </h3>

                <p className="text-sm text-gray-500 mb-2">
                  Bạn có{" "}
                  <span className="font-semibold text-blue-600">
                    {profileData.points}
                  </span>{" "}
                  voucher. Mỗi voucher giảm{" "}
                  <span className="font-semibold">10.000&nbsp;VND</span>.
                </p>

                <div className="flex items-center justify-center space-x-3">
                  <button
                    onClick={() =>
                      handleUpdateQuantityVoucher(profileData.pointsUsed - 1)
                    }
                    disabled={profileData.pointsUsed <= 0}
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition disabled:opacity-50"
                  >
                    <Minus className="h-4 w-4 text-gray-700" />
                  </button>

                  <span className="w-12 text-center text-lg font-semibold text-gray-800">
                    {profileData.pointsUsed}
                  </span>

                  <button
                    onClick={() =>
                      handleUpdateQuantityVoucher(profileData.pointsUsed + 1)
                    }
                    disabled={profileData.pointsUsed >= profileData.points}
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition disabled:opacity-50"
                  >
                    <Plus className="h-4 w-4 text-gray-700" />
                  </button>
                </div>

                {/* Hiển thị số tiền giảm */}
                <div className="text-right mt-2 text-sm text-green-600 font-medium">
                  Giảm: {formatPrice(profileData.pointsUsed * 10000)}
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 my-4"></div>

              {/* Tổng cộng */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-bold text-gray-900">
                  Tổng cộng
                </span>
                <span className="text-2xl font-bold text-blue-600">
                  {formatPrice(
                    cart.total - profileData.pointsUsed * 10000 > 0
                      ? cart.total - profileData.pointsUsed * 10000
                      : 0
                  )}
                </span>
              </div>

              {/* Nút Thanh toán */}
              <button
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center space-x-2 mb-4"
              >
                <CreditCard className="h-5 w-5" />
                <span>Tiến Hành Thanh Toán</span>
              </button>

              {/* Security Info */}
              <div className="text-center text-sm text-gray-500">
                <p className="flex items-center justify-center space-x-1">
                  <Package className="h-4 w-4" />
                  <span>Thanh toán an toàn</span>
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
  product?: Product;
  onQuantityChange: (
    itemId: string,
    quantity: number,
    productId: string,
    productName: string
  ) => void;
  onRemove: (itemId: string, itemName: string) => void;
  formatPrice: (price: number) => string;
  loadingProducts: boolean;
}

const CartItemCard: React.FC<CartItemCardProps> = ({
  item,
  product,
  onQuantityChange,
  onRemove,
  formatPrice,
  loadingProducts,
}) => {
  const isAtMaxQuantity = product ? item.quantity >= product.quantity : false;
  const isOutOfStock = product
    ? product.quantity <= 0 || product.isDeleted
    : false;
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
              <span className="text-gray-400 text-xs">Không có ảnh</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {item.name}
          </h3>
          <div className="flex items-center space-x-4 mb-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              Sản phẩm thể thao
            </span>
          </div>
          <p className="text-xl font-bold text-blue-600">
            {formatPrice(item.price)}
          </p>
        </div>

        {/* Quantity and Actions */}
        <div className="flex flex-col items-end space-y-4">
          {/* Quantity Controls */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() =>
                onQuantityChange(
                  item.id,
                  item.quantity - 1,
                  item.productId,
                  item.name
                )
              }
              disabled={item.quantity <= 1}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Minus className="h-4 w-4" />
            </button>
            <div className="flex flex-col items-center">
              <span className="w-12 text-center text-lg font-medium">
                {item.quantity}
              </span>
              {product && (
                <span className="text-xs text-gray-500">
                  /{product.quantity}
                </span>
              )}
            </div>
            <button
              onClick={() =>
                onQuantityChange(
                  item.id,
                  item.quantity + 1,
                  item.productId,
                  item.name
                )
              }
              disabled={isAtMaxQuantity || isOutOfStock || loadingProducts}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {/* Stock Status */}
          {product && (
            <div className="text-center">
              {isOutOfStock ? (
                <span className="text-xs text-red-600 font-medium">
                  Hết hàng
                </span>
              ) : isAtMaxQuantity ? (
                <span className="text-xs text-orange-600 font-medium">
                  Đã đạt tối đa
                </span>
              ) : (
                <span className="text-xs text-gray-500">
                  Còn {product.quantity} sản phẩm
                </span>
              )}
            </div>
          )}

          {/* Item Total */}
          <div className="flex justify-end items-center">
            <p className="text-lg text-gray-500">Tổng:</p>
            <p className="text-lg font-bold text-gray-900 ml-2">
              {formatPrice(item.price * item.quantity)}
            </p>
          </div>

          {/* Remove Button */}
          <button
            onClick={() => onRemove(item.id, item.name)}
            className="flex items-center space-x-1 text-red-500 hover:text-red-700 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            <span className="text-sm font-medium">Xóa</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
