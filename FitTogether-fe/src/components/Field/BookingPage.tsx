// BookingPage.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useField } from "../../hooks";
import { useState } from "react";
import LocationMap from "./LocationMap";
import BookingField from "./BookingField";

const BookingPage = () => {
  const { fieldId } = useParams<{ fieldId: string }>();
  const { field, loading, error } = useField(fieldId);
  const [imageError, setImageError] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const navigate = useNavigate();

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
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Tên sân */}
      <h2 className="text-2xl font-semibold">{field.name}</h2>

      {/* Địa chỉ */}
      <p className="text-gray-700">
        <span className="font-medium">Địa chỉ: </span>
        {field.address}
      </p>

      {/* Giờ mở cửa */}
      <p className="text-gray-700">
        <span className="font-medium">Giờ mở cửa: </span>
        05:00 - 12:00
      </p>

      {/* Giá thuê */}
      <div>
        <p className="font-medium text-gray-800 mb-1">Giá thuê:</p>
        <ul className="list-disc ml-6 text-gray-700">
          <li>
            - Giá thuê:{" "}
            <span className="font-medium">
              Sân Pickleball, số lượng sân 8 - Giá thuê: 220.000 ₫
            </span>
          </li>
        </ul>
      </div>

      {/* Tiện ích */}
      {field.facilities?.length > 0 && (
        <div>
          <p className="font-medium text-gray-800 mb-2">Tiện ích:</p>
          <div className="flex flex-wrap gap-2">
            {field.facilities.map((f: string, i: number) => (
              <span
                key={i}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md text-sm"
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Chủ sân */}
      <p className="text-gray-700">
        <span className="font-medium">Chủ sân: </span>
        Tungg Tungg
      </p>

      {/* Nút đặt sân */}
      <button
        onClick={() => setIsBookingOpen(true)}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-md transition"
      >
        Đặt sân ngay
      </button>

       <BookingField
        open={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        field={field}
      />

      {/* Mô tả */}
      {field.description && (
        <div>
          <h2 className="text-lg font-semibold mb-2">Mô tả</h2>
          <p className="text-gray-600 leading-relaxed">{field.description}</p>
        </div>
      )}

      <img
        src={fieldImage}
        alt={field.name}
        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        onError={() => setImageError(true)}
      />

      <div>
        <h2 className="text-lg font-semibold mb-2">Vị trí trên bản đồ</h2>
        {field && field.address ? (
          <LocationMap address={field.address} />
        ) : (
          <p>Đang tải dữ liệu sân...</p>
        )}
      </div>

     
    </div>
  );
};

export default BookingPage;
