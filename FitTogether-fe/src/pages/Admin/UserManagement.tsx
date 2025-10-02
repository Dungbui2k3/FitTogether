import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Trash2, 
  Eye, 
  Mail,
  Calendar,
  Users,
  Loader2,
  AlertCircle
} from 'lucide-react';
import UserDetailModal from '../../components/Admin/UserDetailModal';
import { userService } from '../../services/userService';
import type { User, UserListParams } from '../../types/user';

const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, ] = useState('all');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  
  // Modal states
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch users from API
  useEffect(() => {
    fetchUsers();
  }, [currentPage, filterRole, filterStatus, searchTerm]);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params: UserListParams = {
        page: currentPage,
        limit: 10,
      };

      if (searchTerm) params.search = searchTerm;
      if (filterRole !== 'all') params.role = filterRole;
      if (filterStatus !== 'all') params.status = filterStatus as 'active' | 'inactive';

      const response = await userService.getUsers(params);
      
      if (response.success && response.data) {
        setUsers(response.data.users || []);
        setTotalPages(response.data.pagination?.totalPages || 1);
        setTotalUsers(response.data.pagination?.total || 0);
      } else {
        setError(response.error || 'Unable to load user list');
        setUsers([]);
      }
    } catch (err) {
      setError('An error occurred while loading data');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

//   const handleStatusChange = async (userId: number, newStatus: 'active' | 'inactive') => {
//     try {
//       const response = await userService.changeUserStatus(userId.toString(), newStatus);
      
//       if (response.success) {
//         // Refresh data
//         await fetchUsers();
//         // Show success message (you can implement toast notifications here)
//         console.log('User status has been updated');
//       } else {
//         console.error(response.error);
//       }
//     } catch (err) {
//       console.error('Error changing status:', err);
//     }
//   };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa người dùng này không?')) {
      return;
    }

    try {
      const response = await userService.deleteUser(userId.toString());
      
      if (response.success) {
        // Refresh data
        await fetchUsers();
        console.log('Người dùng đã được xóa');
      } else {
        console.error(response.error);
      }
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  // Handle view user details
  const handleViewUserDetails = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // Handle close modal
  const handleCloseModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  // Helper function to get user status from User object
  const getUserStatus = (user: User): 'active' | 'inactive' | 'pending' => {
    if (user.isVerified === false) return 'pending';
    return 'active'; // Default to active for verified users
  };

  const getStatusBadge = (user: User) => {
    const status = getUserStatus(user);
    const statusConfig = {
      active: { bg: 'bg-green-100', text: 'text-green-800', label: 'Hoạt Động' },
      inactive: { bg: 'bg-red-100', text: 'text-red-800', label: 'Ngưng Hoạt Động' },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Chờ Duyệt' }
    };

    const config = statusConfig[status];
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getRoleBadge = (role?: string) => {
    const isAdmin = role === 'admin';
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
        isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
      }`}>
        {isAdmin ? 'Quản Trị Viên' : 'Người Dùng'}
      </span>
    );
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const userStatus = getUserStatus(user);
    const matchesStatus = filterStatus === 'all' || userStatus === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản Lý Người Dùng</h1>
            <p className="text-gray-600 mt-1">Quản lý tài khoản người dùng trong hệ thống</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên hoặc email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Role Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="all">Tất Cả Vai Trò</option>
                <option value="admin">Quản Trị Viên</option>
                <option value="user">Người Dùng</option>
              </select>
            </div>

            {/* Status Filter */}
            {/* <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="inactive">Không hoạt động</option>
                <option value="pending">Chờ xác nhận</option>
              </select>
            </div> */}
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center py-12">
              <AlertCircle className="h-8 w-8 text-red-600 mr-2" />
              <div className="text-center">
                <h3 className="text-lg font-medium text-red-900 mb-2">Đã xảy ra lỗi</h3>
                <p className="text-red-600 mb-4">{error}</p>
                <button 
                  onClick={() => fetchUsers()}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {!loading && !error && (
            <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Người Dùng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vai Trò
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng Thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày Tham Gia
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hành Động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">ID: {user._id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-900">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(user)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-900">
                          {new Date(user.createdAt).toLocaleDateString('en-US')}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          className="p-1 text-blue-600 hover:text-blue-900 transition-colors" 
                          title="Xem Chi Tiết"
                          onClick={() => handleViewUserDetails(user)}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {/* <button className="p-1 text-green-600 hover:text-green-900 transition-colors" title="Chỉnh sửa">
                          <Edit className="h-4 w-4" />
                        </button> */}
                        {/* <button 
                          className="p-1 text-gray-600 hover:text-gray-900 transition-colors" 
                          title="Kích hoạt/Vô hiệu hóa"
                          onClick={() => handleStatusChange(user._id, getUserStatus(user) === 'active' ? 'inactive' : 'active')}
                        >
                          {getUserStatus(user) === 'active' ? 
                            <UserX className="h-4 w-4" /> : 
                            <UserCheck className="h-4 w-4" />
                          }
                        </button> */}
                        <button 
                          className="p-1 text-red-600 hover:text-red-900 transition-colors" 
                          title="Xóa"
                          onClick={() => handleDeleteUser(user._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        {/* <button className="p-1 text-gray-600 hover:text-gray-900 transition-colors" title="Thêm hành động">
                          <MoreVertical className="h-4 w-4" />
                        </button> */}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>  
          </div>)}
          
          {/* Empty State */}
          {!loading && !error && filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy người dùng</h3>
              <p className="text-gray-500 mb-4">Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác.</p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Thêm Người Dùng Mới
              </button>
            </div>
          )}       
        </div>

        {/* Pagination */}
        {!loading && !error && filteredUsers.length > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Hiển thị <span className="font-medium">1</span> đến <span className="font-medium">{filteredUsers.length}</span> trong tổng số <span className="font-medium">{totalUsers}</span> người dùng
            </div>
            <div className="flex items-center space-x-2">
              <button 
                className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-50"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Trước
              </button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors">
                {currentPage}
              </button>
              <button 
                className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-50"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Tiếp
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User Detail Modal */}
      <UserDetailModal 
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default UserManagement;