import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fieldService } from "../../services/fieldService";
import { Field } from "../../types/field";
import CreateFieldModal from "../../components/Admin/FieldModals/CreateFieldModal";
import BookingField from "../../components/Field/BookingField";
import { useToast } from "../../hooks";
import {
  MapPin,
  Plus,
  Eye,
  Trash2,
  Phone,
  Calendar,
  Users,
  CalendarDays,
} from "lucide-react";

const MyFieldsPage: React.FC = () => {
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const { showToast } = useToast();

  const fetchMyFields = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fieldService.getMyFields();

      if (response.success) {
        setFields(response.data.fields);
        setPagination(response.data.pagination);
      } else {
        setError(response.error || "Không thể tải danh sách sân");
        showToast(response.error || "Không thể tải danh sách sân", "error");
      }
    } catch (error: any) {
      const errorMessage = "Có lỗi xảy ra khi tải danh sách sân";
      setError(errorMessage);
      showToast(errorMessage, "error");
      console.error("Error fetching my fields:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyFields();
  }, []);

  const filteredFields = fields;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const handleDeleteField = async (fieldId: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sân thể thao này không?")) {
      return;
    }

    try {
      const response = await fieldService.deleteField(fieldId);
      if (response.success) {
        showToast("Xóa sân thể thao thành công", "success");
        fetchMyFields(); // Refresh the list
      } else {
        showToast(response.error || "Không thể xóa sân thể thao", "error");
      }
    } catch (err) {
      showToast("Có lỗi xảy ra khi xóa sân thể thao", "error");
    }
  };

  const handleOpenBooking = (field: Field) => {
    setSelectedField(field);
    setShowBookingModal(true);
  };

  const handleCloseBooking = () => {
    setShowBookingModal(false);
    setSelectedField(null);
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải danh sách sân...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Có lỗi xảy ra
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchMyFields}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Sân Của Tôi
              </h1>
              <p className="text-gray-600">
                Quản lý và theo dõi các sân thể thao của bạn
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Thêm Sân Mới
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Tổng Sân</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {pagination.total}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fields List */}
        {filteredFields.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🏟️</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Chưa có sân nào
            </h3>
            <p className="text-gray-600 mb-6">Hãy thêm sân đầu tiên của bạn</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Thêm Sân Mới
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFields.map((field) => {
              const fieldImage =
                field.images && field.images.length > 0
                  ? field.images[0]
                  : getPlaceholderImage(field.name);

              return (
                <div
                  key={field.id}
                  className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="flex">
                    {/* Field Image */}
                    <div className="w-48 h-32 flex-shrink-0">
                      <img
                        src={fieldImage}
                        alt={field.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Field Info */}
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            {field.name}
                          </h3>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                              <span className="line-clamp-1">
                                {field.address}
                              </span>
                            </div>

                            <div className="flex items-center text-sm text-gray-600">
                              <Phone className="h-4 w-4 mr-2 text-gray-400" />
                              <span>{field.phone}</span>
                            </div>

                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                              <span>{formatDate(field.createdAt)}</span>
                            </div>

                            <div className="flex items-center text-sm text-gray-600">
                              <Users className="h-4 w-4 mr-2 text-gray-400" />
                              <span>{field.subFieldsCount || 0} sân con</span>
                            </div>
                          </div>

                          {/* Facilities */}
                          {field.facilities && field.facilities.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {field.facilities
                                .slice(0, 3)
                                .map((facility, index) => (
                                  <span
                                    key={index}
                                    className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs"
                                  >
                                    {facility}
                                  </span>
                                ))}
                              {field.facilities.length > 3 && (
                                <span className="text-gray-500 text-xs">
                                  +{field.facilities.length - 3} khác
                                </span>
                              )}
                            </div>
                          )}

                          {/* Status */}
                          <div className="flex items-center space-x-2">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                field.isDeleted
                                  ? "bg-red-100 text-red-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {field.isDeleted ? "Đã Xóa" : "Hoạt Động"}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col space-y-2 ml-4">
                          <Link
                            to={`/field-owner/field/${field.id}`}
                            className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Xem Chi Tiết
                          </Link>

                          <Link
                            key={field.id}
                            to={`/field-owner/field-manage/${field.id}`}
                            state={{ field }}
                           className="bg-green-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
                          >
                            <CalendarDays className="h-4 w-4 mr-2" />
                            Đặt Sân
                          </Link>

                          <button
                            onClick={() => handleDeleteField(field.id)}
                            className="bg-red-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-red-700 transition-colors flex items-center justify-center"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Xóa
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <div className="flex items-center space-x-2">
              <button
                disabled={!pagination.hasPrevPage}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Trước
              </button>

              <span className="px-4 py-2 text-gray-600">
                Trang {pagination.page} / {pagination.totalPages}
              </span>

              <button
                disabled={!pagination.hasNextPage}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create Field Modal */}
      <CreateFieldModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={fetchMyFields}
      />

      {/* Booking Field Modal */}
      {showBookingModal && selectedField && (
        <BookingField
          open={showBookingModal}
          onClose={handleCloseBooking}
          field={selectedField}
        />
      )}
    </div>
  );
};

export default MyFieldsPage;
