/**
 * CheckoutPage Component
 *
 * Payment methods available:
 * - PayOS: Online payment gateway
 * - COD: Cash on Delivery
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CreditCard,
  Smartphone,
  MapPin,
  User,
  Plus,
  Minus,
  Ticket,
} from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useToast } from "../hooks";
import { useAuth } from "../hooks";
import { orderService, userService } from "../services";
import { validateCheckoutForm, validateOrderItems } from "../utils/validation";
import { UpdateProfileRequest } from "../types";

interface CheckoutFormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  paymentMethod: "payos" | "cod";
  notes: string;
}

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const { success, error: showError } = useToast();
  const { user } = useAuth();
  const [profileData, setProfileData] = useState({
    points: 0,
    pointsUsed: 0,
  });

  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    paymentMethod: "payos",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      console.log("Profile:", user);
      setProfileData({
        points: user.points || 0,
        pointsUsed: 0,
      });
    }
  }, [user]);

  // Update form data when user data changes
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.name || prev.fullName,
        email: user.email || prev.email,
      }));
    }
  }, [user]);

  // All products are physical sports accessories
  const hasDigitalProducts = false;
  const hasPhysicalProducts = cart.items.length > 0;

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: currency,
    }).format(price);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateQuantityVoucher = (newValue: number) => {
    if (newValue < 0 || newValue > profileData.points) return;
    setProfileData((prev) => ({ ...prev, pointsUsed: newValue }));
  };

  const totalAfterVoucher = Math.max(
    cart.total - profileData.pointsUsed * 10000,
    0
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data
    const formValidation = validateCheckoutForm(formData);
    if (!formValidation.isValid) {
      showError(formValidation.errors.join(", "));
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert cart items to order items
      const orderItems = orderService.convertCartItemsToOrderItems(
        cart.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        }))
      );

      // Validate order items
      const orderValidation = validateOrderItems(orderItems);
      if (!orderValidation.isValid) {
        showError(orderValidation.errors.join(", "));
        return;
      }

      // Prepare order data
      const orderData = {
        items: orderItems,
        paymentMethod: formData.paymentMethod,
        totalAmount: totalAfterVoucher,
        notes: formData.notes || "",
        phone: formData.phone,
        address: formData.address,
      };

      // Create order
      const response = await orderService.createOrder(orderData);
      console.log("Create order response:", response);

      if (response.success) {
        const updates: UpdateProfileRequest = {
          points: profileData.points - profileData.pointsUsed,
        };

        const result = await userService.updateUser(
          user?.id?.toString() || "",
          updates
        );

        console.log("Update user result:", result);

        if (formData.paymentMethod === "cod") {
          success(
            "Đặt hàng thành công! Bạn sẽ thanh toán khi nhận được sản phẩm."
          );
          clearCart();
          // Redirect to success page with order data
          navigate("/order-success", {
            state: {
              order: response.data,
              paymentMethod: "cod",
            },
          });
        } else if (formData.paymentMethod === "payos") {
          // PayOS payment
          success(
            "Đặt hàng thành công! Đang chuyển hướng đến PayOS để thanh toán..."
          );
          clearCart();

          // Check if payment URL exists
          if (response.data.payment?.checkoutUrl) {
            // Redirect to PayOS checkout URL
            window.location.href = response.data.payment.checkoutUrl;
          } else {
            showError(
              "Không tìm thấy URL thanh toán. Vui lòng liên hệ hỗ trợ."
            );
            navigate("/");
          }
        }
      } else {
        showError(response.error || "Không thể đặt hàng. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Order creation error:", error);
      showError("Không thể đặt hàng. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Giỏ hàng của bạn đang trống
            </h1>
            <p className="text-gray-600 mb-8">
              Vui lòng thêm sản phẩm trước khi thanh toán.
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Tiếp tục mua sắm
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
        <div className="flex items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Thanh toán</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Contact Information */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Thông tin liên hệ
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Họ và tên *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nhập họ và tên của bạn"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số điện thoại *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nhập số điện thoại của bạn"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Địa chỉ email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nhập địa chỉ email của bạn"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Địa chỉ *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập địa chỉ đầy đủ của bạn"
                  />
                </div>
              </div>

              {/* Order Notes */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-1 flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Thông tin bổ sung
                </h2>
                <label className="block text-sm font-medium text-gray-700 mb-0">
                  (Hỗ trợ in chữ lên vợt (giới hạn 20 ký tự) + đổi màu cuối cán
                  vợt miễn phí)
                </label>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ghi chú đơn hàng
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Các yêu cầu đặc biệt cho đơn hàng của bạn..."
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Phương thức thanh toán
                </h2>

                <div className="space-y-4">
                  {/* PayOS Payment */}
                  <label
                    className={`flex items-center p-4 border-2 rounded-lg transition-colors ${
                      formData.paymentMethod === "payos"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="payos"
                      checked={formData.paymentMethod === "payos"}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="ml-4">
                      <div className="flex items-center">
                        <CreditCard className="h-5 w-5 text-blue-600 mr-2" />
                        <span className="text-sm font-medium text-gray-900">
                          Thanh toán PayOS
                        </span>
                        <span className="ml-2 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          Khả dụng
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Thanh toán trực tuyến an toàn và nhanh chóng qua PayOS
                      </p>
                    </div>
                  </label>

                  <label
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      formData.paymentMethod === "cod"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    } ${
                      hasDigitalProducts ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === "cod"}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="ml-4">
                      <div className="flex items-center">
                        <Smartphone className="h-5 w-5 text-green-600 mr-2" />
                        <span className="text-sm font-medium text-gray-900">
                          Thanh toán khi nhận hàng
                        </span>
                        {hasDigitalProducts && (
                          <span className="ml-2 px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                            Không khả dụng
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Thanh toán khi bạn nhận được sản phẩm. Chỉ khả dụng cho
                        sản phẩm vật lý.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      navigate("/cart");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                  >
                    <ArrowLeft className="h-5 w-5" />
                    <span>Quay lại giỏ hàng</span>
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Đang xử lý đơn hàng...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-5 w-5" />
                        <span>Đặt hàng</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Tóm tắt đơn hàng
              </h2>

              {/* Order Items */}
              <div className="space-y-4 mb-6">
                {cart.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                          <span className="text-gray-500 text-xs">
                            No Image
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {item.name}
                      </h3>
                      <p className="text-xs text-gray-500">Sản phẩm thể thao</p>
                      <p className="text-sm font-semibold text-blue-600">
                        {formatPrice(item.price * item.quantity, "VND")}
                      </p>
                    </div>
                    <div className="text-sm text-gray-500">
                      x{item.quantity}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">
                    Tạm tính ({cart.itemCount})
                  </span>
                  <span className="font-medium">
                    {formatPrice(cart.total, "VND")}
                  </span>
                </div>

                <div className="mt-4 mb-4 border-t border-gray-100 pt-4">
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

                  <div className="text-right mt-2 text-sm text-green-600 font-medium">
                    Giảm: {formatPrice(profileData.pointsUsed * 10000, "VND")}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Phí vận chuyển</span>
                  <span className="font-medium">
                    {hasPhysicalProducts ? (
                      formatPrice(0, "VND")
                    ) : (
                      <span className="text-green-600">Free</span>
                    )}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">
                      Tổng cộng
                    </span>
                    <span className="text-xl font-bold text-blue-600">
                      {formatPrice(totalAfterVoucher, "VND")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
