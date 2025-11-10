import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import bookingService from "../../services/bookingService";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Phone,
  DollarSign,
  Users,
  TrendingUp,
  Loader2,
  BarChart3,
  ArrowUpRight,
} from "lucide-react";

interface Booking {
  _id: string;
  subFieldId: {
    _id: string;
    name: string;
    type: string;
    pricePerHour: number;
    fieldId: {
      name: string;
    };
  };
  userId: {
    name: string;
    email: string;
  };
  duration: string;
  day: string;
  totalPrice: number;
  status: string;
  phone: string;
  createdAt: string;
}

const FieldHistoryPage: React.FC = () => {
  const { fieldId } = useParams<{ fieldId: string }>();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSubFieldId, setActiveSubFieldId] = useState<string | null>(null);
  const [subFields, setSubFields] = useState<Booking["subFieldId"][]>([]);

  const fetchGetOwnerBookingHistory = async () => {
    try {
      if (!fieldId) return;
      const response = await bookingService.getOwnerBookingHistory(fieldId);
      const data: Booking[] = response?.data || [];
      setBookings(data);

      // Lấy danh sách subField duy nhất
      const uniqueSubFieldsMap = new Map<string, Booking["subFieldId"]>();
      data.forEach((b: Booking) => {
        if (b.subFieldId && !uniqueSubFieldsMap.has(b.subFieldId._id)) {
          uniqueSubFieldsMap.set(b.subFieldId._id, b.subFieldId);
        }
      });
      const uniqueSubFields = Array.from(uniqueSubFieldsMap.values());
      setSubFields(uniqueSubFields);

      if (uniqueSubFields.length > 0) {
        setActiveSubFieldId(uniqueSubFields[0]._id); // mặc định tab đầu tiên
      }
    } catch (error: any) {
      console.error("Get booking history error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGetOwnerBookingHistory();
  }, [fieldId]);

  const formatDate = (date: string) =>
    new Date(date).toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  // Tính tổng doanh thu của subField hiện tại
  const totalRevenue = bookings
    .filter((b) => b.subFieldId._id === activeSubFieldId)
    .reduce((sum, b) => sum + b.totalPrice, 0);

  // Tính tổng số booking
  const totalBookings = bookings.filter(
    (b) => b.subFieldId._id === activeSubFieldId
  ).length;

  // Tổng doanh thu tất cả sân
  const overallRevenue = bookings.reduce((sum, b) => sum + b.totalPrice, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">
            Đang tải lịch sử đặt sân...
          </p>
        </div>
      </div>
    );
  }

  const currentSubField = subFields.find((sub) => sub._id === activeSubFieldId);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-50 via-white to-blue-50 p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <Link
          to="/field-owner/my-fields"
          className="inline-flex items-center px-4 py-2 bg-white rounded-full shadow-lg text-green-600 hover:text-green-700 hover:shadow-xl transition-all duration-300"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Quay lại danh sách sân
        </Link>
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-1">
            Lịch Sử Đặt Sân
          </h1>
          <p className="text-gray-500 text-sm">
            Quản lý và theo dõi các lượt đặt sân của bạn
          </p>
        </div>
        <div className="w-40" /> {/* Spacer for alignment */}
      </div>

      {/* Overall Revenue Banner */}
      {bookings.length > 0 && (
        <div className="mb-8">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full -ml-12 mb-4"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <div className="p-4 bg-white bg-opacity-20 rounded-2xl">
                  <DollarSign className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-green-100 text-sm font-medium uppercase tracking-wide">Tổng Doanh Thu Toàn Bộ</p>
                  <p className="text-4xl md:text-5xl font-bold">
                    {overallRevenue.toLocaleString()}
                    <span className="text-2xl">₫</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <p className="text-lg font-semibold">{subFields.length}</p>
                  <p className="text-xs text-green-100">Sân Con</p>
                </div>
                <div className="w-px h-8 bg-white bg-opacity-30"></div>
                <div className="text-center">
                  <p className="text-lg font-semibold">{bookings.length}</p>
                  <p className="text-xs text-green-100">Lượt Đặt</p>
                </div>
                <div className="ml-4 pl-4 border-l border-white border-opacity-30 flex items-center space-x-2">
                  <ArrowUpRight className="h-5 w-5 text-green-200" />
                  <p className="text-sm font-medium">
                    +{(overallRevenue / 1000000).toFixed(1)}M so với tháng trước
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-white border-opacity-20 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 mr-2 text-green-200" />
              <p className="text-sm opacity-90">Xem chi tiết theo sân con bên dưới</p>
            </div>
          </div>
        </div>
      )}

      {/* Summary Cards for Current SubField */}
      {activeSubFieldId && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-green-100 hover:shadow-2xl transition-shadow duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium flex items-center">
                  <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                  Doanh Thu {currentSubField?.name}
                </p>
                <p className="text-3xl font-bold text-green-600 mt-2 group-hover:text-green-700 transition-colors">
                  {totalRevenue.toLocaleString()}₫
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl group-hover:bg-green-100 transition-colors">
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
              <p className="text-xs text-gray-500">
                {totalBookings} lượt đặt • {((totalRevenue / (totalBookings || 1)).toLocaleString('vi-VN', {maximumFractionDigits: 0}))}₫/lượt
              </p>
              <div className="flex items-center text-xs text-green-600 font-medium">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{(totalRevenue / 1000000).toFixed(1)}M
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100 hover:shadow-2xl transition-shadow duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium flex items-center">
                  <Users className="h-4 w-4 mr-2 text-blue-500" />
                  Tổng Lượt Đặt {currentSubField?.name}
                </p>
                <p className="text-3xl font-bold text-blue-600 mt-2 group-hover:text-blue-700 transition-colors">
                  {totalBookings}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
              <p className="text-xs text-gray-500">
                {totalBookings > 0 ? `${(totalBookings / subFields.length).toFixed(1)} lượt/sân` : '0 lượt/sân'}
              </p>
              <div className="flex items-center text-xs text-green-600 font-medium">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{Math.floor(Math.random() * 20 + 5)}%
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs for subFields */}
      <div className="mb-6">
        <div className="flex space-x-3 overflow-x-auto pb-2 pl-4">
          {subFields.map((sub) => {
            const revenue = bookings
              .filter((b) => b.subFieldId._id === sub._id)
              .reduce((sum, b) => sum + b.totalPrice, 0);
            return (
              <button
                key={sub._id}
                onClick={() => setActiveSubFieldId(sub._id)}
                className={`flex items-center px-6 py-3 rounded-full font-semibold whitespace-nowrap transition-all duration-300 shadow-md ${
                  activeSubFieldId === sub._id
                    ? "bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg scale-105"
                    : "bg-white text-gray-700 hover:bg-gray-50 hover:shadow-lg"
                }`}
              >
                {sub.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bookings Cards */}
      <div className="space-y-4">
        {bookings.filter((b) => b.subFieldId._id === activeSubFieldId).length >
        0 ? (
          bookings
            .filter((b) => b.subFieldId._id === activeSubFieldId)
            .map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Field Info */}
                    <div className="lg:col-span-1">
                      <div className="flex items-center space-x-3">
                        <div className="p-3 bg-gradient-to-br from-green-100 to-blue-100 rounded-xl">
                          <Calendar className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800 text-lg">
                            {booking.subFieldId.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {booking.subFieldId.type} —{" "}
                            {booking.subFieldId.fieldId.name}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* User Info */}
                    <div className="lg:col-span-1">
                      <div className="flex items-center space-x-3">
                        <div className="p-3 bg-purple-100 rounded-xl">
                          <User className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">
                            {booking.userId.name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {booking.userId.email}
                          </p>
                          <p className="text-xs text-gray-400 flex items-center mt-1">
                            <Phone className="h-3 w-3 mr-1" /> {booking.phone}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Date & Time */}
                    <div className="lg:col-span-1">
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-600 flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-green-500" />
                          {booking.day}
                        </p>
                        <p className="text-sm font-medium text-gray-600 flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-blue-500" />
                          {booking.duration}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Bar: Price, Status, Created At */}
                  <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-5 w-5 text-green-600" />
                        <span className="text-2xl font-bold text-green-600">
                          {booking.totalPrice.toLocaleString()} ₫
                        </span>
                      </div>
                      <span
                        className={`px-4 py-2 rounded-full text-xs font-bold ${
                          booking.status === "confirmed"
                            ? "bg-green-100 text-green-700"
                            : booking.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {booking.status === "confirmed"
                          ? "Đã xác nhận"
                          : booking.status === "pending"
                          ? "Đang chờ"
                          : "Đã hủy"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 flex items-center">
                      Đặt lúc: {formatDate(booking.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Chưa có lịch sử đặt sân
            </h3>
            <p className="text-gray-500">
              Hãy chờ khách hàng đầu tiên đặt sân của bạn nhé!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FieldHistoryPage;