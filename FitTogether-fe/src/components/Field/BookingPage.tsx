// BookingPage.tsx
import { useParams } from "react-router-dom";
import { useField } from "../../hooks";
import { useState } from "react";
import LocationMap from "./LocationMap";
import BookingField from "./BookingField";

const BookingPage = () => {
  const { fieldId } = useParams<{ fieldId: string }>();
  const { field, loading, error } = useField(fieldId);
  const [imageError, setImageError] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  if (loading) return <p className="p-4">Đang tải thông tin sân...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;
  if (!field) return <p className="p-4">Không tìm thấy sân</p>;

  const getPlaceholderImage = (fieldName: string) => {
    const name = fieldName.toLowerCase();
    if (name.includes("bóng đá") || name.includes("football")) {
      return "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=250&fit=crop&crop=center";
    } else if (name.includes("cầu lông") || name.includes("badminton")) {
      return "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=250&fit=crop&crop=center";
    } else if (name.includes("tennis")) {
      return "https://images.unsplash.com/photo-1542144582-1ba00456b5e3?w=400&h=250&fit=crop&crop=center";
    } else if (name.includes("bóng rổ") || name.includes("basketball")) {
      return "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=250&fit=crop&crop=center";
    } else {
      return "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop&crop=center";
    }
  };

  const fieldImage =
    field.images && field.images.length > 0 && !imageError
      ? field.images[0]
      : getPlaceholderImage(field.name);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto p-4">
        {/* Hero Section */}
        <div className="relative rounded-lg overflow-hidden shadow-lg mb-6">
          <img
            src={fieldImage}
            alt={field.name}
            className="w-full h-64 object-cover"
            onError={() => setImageError(true)}
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="absolute bottom-4 left-4 text-white">
            <h1 className="text-3xl font-bold mb-2">{field.name}</h1>
            <p className="text-lg opacity-90">{field.address}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">
            {/* Field Information Cards */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Thông Tin Sân</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Giờ mở cửa</p>
                    <p className="font-medium text-gray-800">05:00 - 12:00</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Chủ sân</p>
                    <p className="font-medium text-gray-800">Tungg Tungg</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Facilities */}
            {field.facilities?.length > 0 && (
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Tiện Ích</h2>
                <div className="flex flex-wrap gap-2">
                  {field.facilities.map((f: string, i: number) => (
                    <span
                      key={i}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm font-medium"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {field.description && (
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Mô Tả</h2>
                <p className="text-gray-600 leading-relaxed">{field.description}</p>
              </div>
            )}

            {/* Map */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Vị Trí</h2>
              {field && field.address ? (
                <LocationMap address={field.address} />
              ) : (
                <div className="h-48 bg-gray-100 rounded flex items-center justify-center">
                  <p className="text-gray-500">Đang tải dữ liệu sân...</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Pricing Card */}
            {/* <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Giá Thuê</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded border">
                  <div>
                    <p className="font-medium text-gray-800">Sân Pickleball</p>
                    <p className="text-sm text-gray-600">8 sân</p>
                  </div>
                  <span className="text-lg font-bold text-blue-600">220.000 ₫</span>
                </div>
              </div>
            </div> */}

            {/* Booking Button */}
            <div className="bg-blue-600 rounded-lg shadow p-4 text-white">
              <h3 className="text-lg font-semibold mb-2">Sẵn Sàng Đặt Sân?</h3>
              <p className="text-blue-100 mb-4 text-sm">Chọn ngày và khung giờ phù hợp với bạn</p>
              <button
                onClick={() => setIsBookingOpen(true)}
                className="w-full bg-white text-blue-600 py-2 px-4 rounded font-medium hover:bg-gray-100 transition-colors"
              >
                Đặt Sân Ngay
              </button>
            </div>

            {/* Quick Info */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Thông Tin Nhanh</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700 text-sm">Sân chất lượng cao</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700 text-sm">Dịch vụ chuyên nghiệp</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700 text-sm">Đặt sân dễ dàng</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BookingField
        open={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        field={field}
      />
    </div>
  );
};

export default BookingPage;
