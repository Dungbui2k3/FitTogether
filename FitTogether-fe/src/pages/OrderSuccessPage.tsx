import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Package,
  Phone,
  Mail,
  Calendar,
  ArrowLeft,
  CreditCard,
  Truck,
} from "lucide-react";
import { Order } from "../types/order";

const OrderSuccessPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get order data from location state
    const orderData = location.state?.order;
    if (orderData) {
      setOrder(orderData);
      setLoading(false);
    } else {
      // If no order data, redirect to home
      navigate("/");
    }
  }, [location.state, navigate]);

  const formatPrice = (price: number, currency: string = "VND") => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: currency,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "success":
        return "text-green-600 bg-green-100";
      case "cancel":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Đang xử lý";
      case "success":
        return "Thành công";
      case "cancel":
        return "Đã hủy";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Không tìm thấy đơn hàng
          </h1>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-10">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-green-400 to-green-600 mb-6 shadow-lg">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Đặt hàng thành công!
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ xử lý đơn hàng của bạn trong
            thời gian sớm nhất.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
                Thông tin đơn hàng
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 gap-x-16 mb-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    Mã đơn hàng
                  </label>
                  <p className="text-2xl font-bold text-blue-600">
                    {/* #{order._id.slice(-8).toUpperCase()} */}
                    {order.orderCode}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    Trạng thái
                  </label>
                  <span
                    className={`inline-flex px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {getStatusText(order.status)}
                  </span>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    Ngày đặt hàng
                  </label>
                  <p className="text-lg text-gray-900 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-gray-400" />
                    {formatDate(order.orderDate)}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    Tổng tiền
                  </label>
                  <p className="text-2xl font-bold text-green-600">
                    {formatPrice(order.totalAmount)}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Sản phẩm đã đặt
                </h3>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
                      onClick={() => navigate(`/product/${item.productId._id}`)}
                    >
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">
                          {item.productId?.name ||
                            `Mã sản phẩm: ${item.productId}`}
                        </h4>
                        <div className="flex items-center space-x-4">
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            Sản phẩm thể thao
                          </span>
                          <span className="text-sm text-gray-600">
                            SL: {item.quantity}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-900">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatPrice(item.price)} × {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="p-2 bg-green-100 rounded-lg mr-3">
                  <CreditCard className="h-5 w-5 text-green-600" />
                </div>
                Thông tin thanh toán
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">
                    Phương thức thanh toán:
                  </span>
                  <span className="font-bold text-gray-900 flex items-center">
                    <Truck className="h-4 w-4 mr-2 text-green-600" />
                    Thanh toán khi nhận hàng (COD)
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">
                    Tổng đơn hàng:
                  </span>
                  <span className="text-lg font-bold text-gray-900">
                    {formatPrice(order.totalAmount)}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                    <span className="text-lg font-bold text-gray-900">
                      Tổng cộng:
                    </span>
                    <span className="text-xl font-bold text-green-600">
                      {formatPrice(order.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Tiếp theo
              </h2>

              <div className="space-y-4">
                <button
                  onClick={() => navigate("/")}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Tiếp tục mua sắm
                </button>

                <button
                  onClick={() => navigate("/purchase-history")}
                  className="w-full bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 py-3 px-4 rounded-xl font-bold hover:from-gray-200 hover:to-gray-300 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Xem đơn hàng của tôi
                </button>

                <div className="pt-6 border-t border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-3">Cần hỗ trợ?</h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    Nếu bạn có bất kỳ câu hỏi nào về đơn hàng của mình, vui lòng
                    liên hệ chúng tôi:
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                      <Phone className="h-4 w-4 mr-2 text-blue-600" />
                      <span className="font-medium text-gray-800 text-sm">
                        0123 456 789
                      </span>
                    </div>
                    <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                      <Mail className="h-4 w-4 mr-2 text-blue-600" />
                      <span className="font-medium text-gray-800 text-sm">
                        support@fittogether.vn
                      </span>
                    </div>
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

export default OrderSuccessPage;
