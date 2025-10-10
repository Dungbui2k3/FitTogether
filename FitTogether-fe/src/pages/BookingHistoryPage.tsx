import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Calendar, Truck, RefreshCw } from "lucide-react";
import { useAuth } from "../hooks";
import { useToast } from "../hooks";
import bookingService from "../services/bookingService";
import { Booking } from "../types/booking";

const BookingHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { success, error: showError } = useToast();
  const [orders, setOrders] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user?.id]);

  const fetchOrders = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const response = await bookingService.getBookingsByUserId(
        user.id.toString()
      );

      console.log("Fetched orders:", response.data);
      if (response.data) {
        setOrders(response.data || []);
        console.log("Fetched orders:", response.data?.data);
      } else {
        showError(response.message || "Không thể tải danh sách đơn hàng");
        setOrders([]);
      }
    } catch (error) {
      showError("Không thể tải danh sách đơn hàng");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
    success("Danh sách đơn hàng đã được cập nhật");
  };

  const formatPrice = (price: number, currency: string = "VND") => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: currency,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "confirmed":
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
        return "Hoàn thành";
      case "cancel":
        return "Đã hủy";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải danh sách đơn hàng...</p>
          <button
            onClick={() => fetchOrders()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Tải lại thủ công
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Lịch sử đặt sân
              </h1>
              <p className="text-gray-600 mt-1">
                Tìm thấy {orders.length} ca đặt sân
              </p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
            />
            Cập nhật
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
              <Package className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không tìm thấy ca nào
            </h3>
            <p className="text-gray-600 mb-6">Bạn chưa đặt ca nào.</p>
            <button
              onClick={() => navigate("/")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Bắt đầu đặt sân
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Order Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Package className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {order._id}
                        </h3>
                        <p className="text-sm text-gray-500 flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusText(order.status)}
                      </span>
                      <p className="text-xl font-bold text-gray-900 mt-1">
                        {formatPrice(order.totalPrice)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Info */}
                <div className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">
                    Thông tin sân
                  </h4>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">
                        Tên sân: {order.subFieldId?.fieldId?.name} -{" "}
                        {order.subFieldId?.name}
                      </p>
                      <p className="font-medium text-gray-900">
                        Loại sân: {order.subFieldId?.type}
                      </p>
                      <p className="font-medium text-gray-900">
                        Thời gian: {order.day} ({order.duration})
                      </p>
                      <span className="text-sm text-gray-500">
                        Giá/giờ: {formatPrice(order.subFieldId?.pricePerHour)}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatPrice(order.totalPrice)}
                      </p>
                    </div>
                  </div>

                  {/* Customer Information */}
                  {order.userId && (
                    <div className="px-6 py-4 border-t border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Thông tin khách hàng
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        {order.userId.name && (
                          <div>
                            <span className="text-gray-500">Họ và tên:</span>
                            <p className="font-medium text-gray-900">
                              {order.userId.name}
                            </p>
                          </div>
                        )}
                        {order.phone && (
                          <div>
                            <span className="text-gray-500">
                              Số điện thoại:
                            </span>
                            <p className="font-medium text-gray-900">
                              {order.phone}
                            </p>
                          </div>
                        )}
                        {order.userId.email && (
                          <div>
                            <span className="text-gray-500">Email:</span>
                            <p className="font-medium text-gray-900">
                              {order.userId.email}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingHistoryPage;
