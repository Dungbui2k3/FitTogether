import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import FieldOwnerSidebar from './FieldOwnerSidebar';

const FieldOwnerLayout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleSidebarCollapseChange = (isCollapsed: boolean) => {
    setIsSidebarCollapsed(isCollapsed);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <FieldOwnerSidebar onCollapseChange={handleSidebarCollapseChange} />
        
        {/* Main Content */}
        <div className={`flex-1 min-h-screen transition-all duration-300 ${
          isSidebarCollapsed ? 'ml-20' : 'ml-64'
        }`}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default FieldOwnerLayout;
