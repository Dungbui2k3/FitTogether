import React, { useState, useEffect } from "react";
import { User, Mail, Edit, Save, X, Coins, Gift } from "lucide-react";
import { useAuth, useToast } from "../hooks";
import ToastContainer from "../components/ToastContainer";
import type { UpdateProfileRequest } from "../types/auth";
import { userService } from "../services/userService";

const ProfilePage: React.FC = () => {
  const { user, changePassword, isLoading, error, clearError } = useAuth();
  const { success, toasts, removeToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    points: 0,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [profileError, setProfileError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Initialize profile data when user is loaded
  useEffect(() => {
    if (user) {
      console.log("Profile:", user);
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        points: user.points || 0,
      });
    }
  }, [user]);

  // Clear messages after 5 seconds

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
    if (profileError) setProfileError("");
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    if (passwordError) setPasswordError("");
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError("");
    clearError();

    if (!profileData.name.trim()) {
      setProfileError("Tên không được để trống");
      return;
    }

    try {
      const updates: UpdateProfileRequest = {
        name: profileData.name.trim(),
      };

      // Only include email if it's different from current
      if (profileData.email !== user?.email) {
        updates.email = profileData.email;
      }

      const result = await userService.updateUser(
        user?.id?.toString() || "",
        updates
      );

      if (result.success) {
        success("✅ Cập nhật hồ sơ thành công!", 3000);
        setIsEditing(false);
      } else {
        setProfileError(result.error || "Cập nhật thất bại");
      }
    } catch (err) {
      setProfileError("Có lỗi không mong muốn xảy ra");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    clearError();

    if (!passwordData.currentPassword || !passwordData.newPassword) {
      setPasswordError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError("Mật khẩu mới phải có ít nhất 8 ký tự");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      const result = await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (result.success) {
        success("🔐 Đổi mật khẩu thành công!", 3000);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        setPasswordError(result.error || "Đổi mật khẩu thất bại");
      }
    } catch (err) {
      setPasswordError("Có lỗi không mong muốn xảy ra");
    }
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setProfileError("");
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        points: user.points || 0,
      });
    }
  };

  const cancelPasswordChange = () => {
    setPasswordError("");
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Đang tải thông tin người dùng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Thông Tin Cá Nhân
          </h1>
          <p className="text-gray-600 mt-2">
            Quản lý thông tin tài khoản của bạn
          </p>
        </div>

        {/* Global Error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Information */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                Thông Tin Cơ Bản
              </h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Chỉnh sửa
                </button>
              )}
            </div>

            {profileError && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{profileError}</p>
              </div>
            )}

            <form onSubmit={handleUpdateProfile}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Họ và Tên
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      disabled={true}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số Voucher tích lũy
                  </label>
                  <div className="relative">
                    <Gift className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={user?.points}
                      disabled={true}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="mt-6 flex space-x-3">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
                  </button>
                  <button
                    type="button"
                    onClick={cancelEditing}
                    className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 transition-colors"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Hủy
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Password Change */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Đổi Mật Khẩu
              </h2>
            </div>
            <>
              <form onSubmit={handleChangePassword}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mật khẩu hiện tại
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nhập mật khẩu hiện tại"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mật khẩu mới
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nhập mật khẩu mới (tối thiểu 8 ký tự)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Xác nhận mật khẩu mới
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nhập lại mật khẩu mới"
                    />
                  </div>
                </div>

                <div className="mt-6 flex space-x-3">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isLoading ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
                  </button>
                  <button
                    type="button"
                    onClick={cancelPasswordChange}
                    className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 transition-colors"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Hủy
                  </button>
                </div>
              </form>
            </>
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      <ToastContainer
        toasts={toasts}
        removeToast={removeToast}
        position="top-right"
      />
    </div>
  );
};

export default ProfilePage;
