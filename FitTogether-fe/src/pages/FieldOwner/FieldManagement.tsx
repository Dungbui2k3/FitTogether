import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  MapPin,
  Phone,
  Calendar,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { fieldService } from '../../services/fieldService';
import { useToast } from '../../hooks';
import type { Field, FieldListParams } from '../../types/field';
import CreateFieldModal from '../../components/Admin/FieldModals/CreateFieldModal';
import EditFieldModal from '../../components/Admin/FieldModals/EditFieldModal';

interface FieldManagementState {
  fields: Field[];
  loading: boolean;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  search: string;
  sortBy: 'name' | 'address' | 'createdAt';
  sortOrder: 'asc' | 'desc';
}

const FieldManagement: React.FC = () => {
  const { success, error } = useToast();
  const [state, setState] = useState<FieldManagementState>({
    fields: [],
    loading: false,
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingField, setEditingField] = useState<Field | null>(null);

  // Load fields
  const loadFields = React.useCallback(async () => {
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      const params: FieldListParams = {
        page: state.page,
        limit: state.limit,
        search: state.search || undefined,
        sortBy: state.sortBy,
        sortOrder: state.sortOrder,
      };

      const response = await fieldService.getFields(params);
      
      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          fields: response.data!.fields,
          total: response.data!.pagination.total,
          totalPages: response.data!.pagination.totalPages,
          loading: false,
        }));
      } else {
        error(response.error || 'Không thể tải danh sách sân thể thao');
        setState(prev => ({ ...prev, loading: false }));
      }
    } catch (err) {
      error('Có lỗi xảy ra khi tải danh sách sân thể thao');
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [state.page, state.limit, state.search, state.sortBy, state.sortOrder, error]);

  // Load fields on mount and when dependencies change
  useEffect(() => {
    loadFields();
  }, [loadFields]);

  // Handle search
  const handleSearch = (value: string) => {
    setState(prev => ({ ...prev, search: value, page: 1 }));
  };

  // Handle sort
  const handleSort = (sortBy: 'name' | 'address' | 'createdAt') => {
    setState(prev => ({
      ...prev,
      sortBy,
      sortOrder: prev.sortBy === sortBy && prev.sortOrder === 'asc' ? 'desc' : 'asc',
      page: 1,
    }));
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setState(prev => ({ ...prev, page: newPage }));
  };

  // Handle delete field
  const handleDeleteField = async (fieldId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sân thể thao này không?')) {
      return;
    }

    try {
      const response = await fieldService.deleteField(fieldId);
      if (response.success) {
        success('Xóa sân thể thao thành công');
        loadFields();
      } else {
        error(response.error || 'Không thể xóa sân thể thao');
      }
    } catch (err) {
      error('Có lỗi xảy ra khi xóa sân thể thao');
    }
  };

  // Handle view field details
  const handleViewField = (field: Field) => {
    setSelectedField(field);
    setShowDetailModal(true);
  };

  // Handle edit field
  const handleEditField = (field: Field) => {
    setEditingField(field);
    setShowEditModal(true);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản Lý Sân Thể Thao</h1>
          <p className="text-gray-600 mt-1">
            Quản lý và theo dõi sân thể thao của bạn
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Thêm Sân Mới</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Tìm kiếm sân theo tên hoặc địa chỉ..."
                value={state.search}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filter Button */}
          <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Bộ Lọc</span>
          </button>
        </div>
      </div>

      {/* Fields Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Tên Sân</span>
                    {state.sortBy === 'name' && (
                      <span className="text-blue-600">
                        {state.sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('address')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Địa Chỉ</span>
                    {state.sortBy === 'address' && (
                      <span className="text-blue-600">
                        {state.sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Liên Hệ
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng Thái
                </th>
                <th
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('createdAt')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Ngày Tạo</span>
                    {state.sortBy === 'createdAt' && (
                      <span className="text-blue-600">
                        {state.sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao Tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {state.loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                    <p className="mt-2 text-gray-500">Đang tải...</p>
                  </td>
                </tr>
              ) : state.fields.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Không có sân thể thao nào</p>
                  </td>
                </tr>
              ) : (
                state.fields.map((field) => (
                  <tr key={field.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          {field.images && field.images.length > 0 ? (
                            <img
                              className="h-12 w-12 rounded-lg object-cover"
                              src={field.images[0]}
                              alt={field.name}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/placeholder-field.svg';
                              }}
                            />
                          ) : (
                            <div className="h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center">
                              <MapPin className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {field.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{field.address}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-900">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        {field.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        field.isDeleted
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {field.isDeleted ? 'Đã Xóa' : 'Hoạt Động'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-2" />
                        {formatDate(field.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleViewField(field)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Xem Chi Tiết"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => handleEditField(field)}
                          className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                          title="Chỉnh Sửa"
                        >
                          <Edit className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteField(field.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {state.totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(state.page - 1)}
                disabled={state.page === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Trước
              </button>
              <button
                onClick={() => handlePageChange(state.page + 1)}
                disabled={state.page === state.totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sau
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Hiển thị{' '}
                  <span className="font-medium">
                    {(state.page - 1) * state.limit + 1}
                  </span>{' '}
                  đến{' '}
                  <span className="font-medium">
                    {Math.min(state.page * state.limit, state.total)}
                  </span>{' '}
                  trong tổng số{' '}
                  <span className="font-medium">{state.total}</span> kết quả
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => handlePageChange(state.page - 1)}
                    disabled={state.page === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  {Array.from({ length: Math.min(5, state.totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          state.page === page
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => handlePageChange(state.page + 1)}
                    disabled={state.page === state.totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Field Detail Modal */}
      {showDetailModal && selectedField && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Chi Tiết Sân Thể Thao
                  </h2>
                  <p className="text-gray-600">{selectedField.name}</p>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      selectedField.isDeleted
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {selectedField.isDeleted ? 'Đã Xóa' : 'Hoạt Động'}
                    </span>
                    <span className="text-xs text-gray-500">
                      ID: {selectedField.id}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Field Images */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Hình Ảnh</h3>
                {selectedField.images && selectedField.images.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4">
                    {selectedField.images.slice(0, 4).map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${selectedField.name} ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ))}
                    {selectedField.images.length > 4 && (
                      <div className="flex items-center justify-center bg-gray-100 rounded-lg">
                        <span className="text-gray-500 text-sm">
                          +{selectedField.images.length - 4} hình khác
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center bg-gray-100 rounded-lg h-32">
                    <span className="text-gray-500 italic">Chưa có hình ảnh</span>
                  </div>
                )}
              </div>

              {/* Basic Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Thông Tin Cơ Bản</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Tên Sân</p>
                    <p className="font-medium text-gray-900">{selectedField.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Số Điện Thoại</p>
                    <p className="font-medium text-gray-900 flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      {selectedField.phone}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500">Địa Chỉ</p>
                    <p className="font-medium text-gray-900 flex items-start">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400 mt-0.5 flex-shrink-0" />
                      {selectedField.address}
                    </p>
                  </div>
                  {selectedField.description && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-500">Mô Tả</p>
                      <p className="font-medium text-gray-900">{selectedField.description}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Facilities */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Tiện Ích</h3>
                <div className="grid grid-cols-1 gap-2">
                  {selectedField.facilities && selectedField.facilities.length > 0 ? (
                    selectedField.facilities.map((facility, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-gray-700">{facility}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">Chưa có tiện ích nào</p>
                  )}
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Khung Giờ Hoạt Động</h3>
                <div className="grid grid-cols-1 gap-2">
                  {selectedField.slots && selectedField.slots.length > 0 ? (
                    selectedField.slots.map((slot, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-700">{slot}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">Chưa có khung giờ nào</p>
                  )}
                </div>
              </div>

              {/* Status and Dates */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Trạng Thái & Thời Gian</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Trạng Thái</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedField.isDeleted
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {selectedField.isDeleted ? 'Đã Xóa' : 'Hoạt Động'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Ngày Tạo</p>
                    <p className="font-medium text-gray-900 flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      {formatDate(selectedField.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Cập Nhật Lần Cuối</p>
                    <p className="font-medium text-gray-900 flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      {formatDate(selectedField.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Đóng
                </button>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    handleEditField(selectedField);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Chỉnh Sửa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Field Modal */}
      <CreateFieldModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={loadFields}
      />

      {/* Edit Field Modal */}
      <EditFieldModal
        isOpen={showEditModal}
        field={editingField}
        onClose={() => {
          setShowEditModal(false);
          setEditingField(null);
        }}
        onSuccess={loadFields}
      />
    </div>
  );
};

export default FieldManagement;
