import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import { useToast } from '../../hooks';
import ToastContainer from '../ToastContainer';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { toasts, removeToast } = useToast();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleSidebarCollapseChange = (collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar onCollapseChange={handleSidebarCollapseChange} />
      
      {/* Main Content */}
      <div className={`transition-all duration-300 ${
        isSidebarCollapsed ? 'ml-20' : 'ml-64'
      }`}>
        <main className="min-h-screen">
          {children}
        </main>
      </div>

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} position="top-right" />
    </div>
  );
};

export default AdminLayout;