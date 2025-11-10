import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight, LogOut, Building2, History } from "lucide-react";
import { useAuth } from "../../hooks";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  isActive: boolean;
  isCollapsed: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  to,
  isActive,
  isCollapsed,
}) => {
  return (
    <Link
      to={to}
      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
        isActive
          ? "bg-green-600 text-white shadow-lg"
          : "text-gray-700 hover:bg-gray-100 hover:text-green-600"
      }`}
      title={isCollapsed ? label : ""}
    >
      <div className="flex-shrink-0">{icon}</div>
      {!isCollapsed && <span className="font-medium">{label}</span>}
      {isCollapsed && isActive && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          {label}
        </div>
      )}
    </Link>
  );
};

interface FieldOwnerSidebarProps {
  onCollapseChange?: (isCollapsed: boolean) => void;
}

const FieldOwnerSidebar: React.FC<FieldOwnerSidebarProps> = ({
  onCollapseChange,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleCollapseToggle = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    onCollapseChange?.(newCollapsedState);
  };

  const handleLogout = async () => {
    await logout();
  };

  const menuItems = [
    {
      icon: <Building2 className="h-5 w-5" />,
      label: "Sân Của Tôi",
      to: "/field-owner/my-fields",
    },
  ];

  return (
    <div
      className={`fixed left-0 top-0 h-screen bg-white shadow-xl border-r border-gray-200 transition-all duration-300 z-40 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div>
                <h1 className="text-xl font-bold text-gray-800">Quản Lý Sân</h1>
                <p className="text-sm text-gray-500">Chủ sân thể thao</p>
              </div>
            )}
            <button
              onClick={handleCollapseToggle}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isCollapsed ? (
                <ChevronRight className="h-5 w-5 text-gray-600" />
              ) : (
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* User Info */}
        {!isCollapsed && (
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-800">{user?.name}</p>
                <p className="text-sm text-gray-500 capitalize">
                  Chủ sân thể thao
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.to}
              icon={item.icon}
              label={item.label}
              to={item.to}
              isActive={location.pathname === item.to}
              isCollapsed={isCollapsed}
            />
          ))}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors w-full"
            title={isCollapsed ? "Đăng Xuất" : ""}
          >
            <LogOut className="h-5 w-5" />
            {!isCollapsed && <span className="font-medium">Đăng Xuất</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FieldOwnerSidebar;
