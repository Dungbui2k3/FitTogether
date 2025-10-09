import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fieldService } from '../../services/fieldService';
import { Field } from '../../types/field';
import { useToast } from '../../hooks';
import { MapPin, ArrowLeft, Edit, Trash2, Eye, Phone, Calendar, Users } from 'lucide-react';
import LocationMap from '../../components/Field/LocationMap';
import EditFieldModal from '../../components/Admin/FieldModals/EditFieldModal';

const FieldDetailPage: React.FC = () => {
  const { fieldId } = useParams<{ fieldId: string }>();
  const [field, setField] = useState<Field | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const { showToast } = useToast();

  const fetchField = async () => {
    if (!fieldId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fieldService.getFieldById(fieldId);
      
      if (response.success) {
        setField(response.data);
      } else {
        setError(response.error || 'Không thể tải thông tin sân');
        showToast(response.error || 'Không thể tải thông tin sân', 'error');
      }
    } catch (error: any) {
      const errorMessage = 'Có lỗi xảy ra khi tải thông tin sân';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      console.error('Error fetching field:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchField();
  }, [fieldId]);

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const handleDeleteField = async () => {
    if (!field?.id) return;
    
    if (!window.confirm('Bạn có chắc chắn muốn xóa sân thể thao này không?')) {
      return;
    }

    try {
      const response = await fieldService.deleteField(field.id);
      if (response.success) {
        showToast('Xóa sân thể thao thành công', 'success');
        // Redirect back to my fields page
        window.location.href = '/field-owner/my-fields';
      } else {
        showToast(response.error || 'Không thể xóa sân thể thao', 'error');
      }
    } catch (err) {
      showToast('Có lỗi xảy ra khi xóa sân thể thao', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin sân...</p>
        </div>
      </div>
    );
  }

  if (error || !field) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Có lỗi xảy ra</h2>
          <p className="text-gray-600 mb-4">{error || 'Không tìm thấy sân'}</p>
          <Link
            to="/field-owner/my-fields"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors inline-block"
          >
            Quay lại danh sách sân
          </Link>
        </div>
      </div>
    );
  }

  const fieldImage = field.images && field.images.length > 0 && !imageError
    ? field.images[0]
    : getPlaceholderImage(field.name);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto p-4">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/field-owner/my-fields"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Quay lại danh sách sân
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{field.name}</h1>
              <p className="text-gray-600">{field.address}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowEditModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Edit className="h-4 w-4 mr-2" />
                Chỉnh Sửa
              </button>
              <button
                onClick={handleDeleteField}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Xóa
              </button>
            </div>
          </div>
        </div>

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
            <div className="flex items-center space-x-4">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                field.isDeleted
                  ? 'bg-red-100 text-red-800'
                  : 'bg-green-100 text-green-800'
              }`}>
                {field.isDeleted ? 'Đã Xóa' : 'Hoạt Động'}
              </span>
              <span className="text-xs opacity-75">
                ID: {field.id}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">
            {/* Field Information */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Thông Tin Sân</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Địa chỉ</p>
                    <p className="font-medium text-gray-800">{field.address}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Số điện thoại</p>
                    <p className="font-medium text-gray-800">{field.phone}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded">
                    <Calendar className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Ngày tạo</p>
                    <p className="font-medium text-gray-800">{formatDate(field.createdAt)}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-100 rounded">
                    <Users className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Số sân con</p>
                    <p className="font-medium text-gray-800">{field.subFieldsCount || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Facilities */}
            {field.facilities?.length > 0 && (
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Tiện Ích</h2>
                <div className="flex flex-wrap gap-2">
                  {field.facilities.map((facility, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm font-medium"
                    >
                      {facility}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Time Slots */}
            {field.slots?.length > 0 && (
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Khung Giờ Hoạt Động</h2>
                <div className="flex flex-wrap gap-2">
                  {field.slots.map((slot, index) => (
                    <span
                      key={index}
                      className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm font-medium"
                    >
                      {slot}
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
            {/* Field Images */}
            {field.images && field.images.length > 0 && (
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Hình Ảnh</h3>
                <div className="grid grid-cols-2 gap-2">
                  {field.images.slice(0, 4).map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${field.name} ${index + 1}`}
                      className="w-full h-24 object-cover rounded"
                    />
                  ))}
                  {field.images.length > 4 && (
                    <div className="flex items-center justify-center bg-gray-100 rounded">
                      <span className="text-gray-500 text-sm">
                        +{field.images.length - 4} hình khác
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SubFields */}
            {field.subFields && field.subFields.length > 0 && (
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Sân Con</h3>
                <div className="space-y-2">
                  {field.subFields.map((subField: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-blue-50 rounded border">
                      <div>
                        <p className="font-medium text-gray-800">{subField.name}</p>
                        <p className="text-sm text-gray-600">{subField.type}</p>
                      </div>
                      <span className="text-lg font-bold text-blue-600">
                        {subField.pricePerHour?.toLocaleString()} ₫
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
                  <span className="text-gray-700 text-sm">Quản lý dễ dàng</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Field Modal */}
      <EditFieldModal
        isOpen={showEditModal}
        field={field}
        onClose={() => setShowEditModal(false)}
        onSuccess={fetchField}
      />
    </div>
  );
};

export default FieldDetailPage;
