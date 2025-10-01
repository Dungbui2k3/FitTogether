import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, useToast } from '../../hooks';

interface AdminRouteProps {
  children: React.ReactNode;
  fallback?: string;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ 
  children, 
  fallback = '/' 
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const { error } = useToast();
  const location = useLocation();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  // Show unauthorized access notification when user is not admin
  useEffect(() => {
    if (!isLoading && isAuthenticated && user && user.role !== 'admin') {
      error('🚫 Bạn không có quyền truy cập trang này!', 3000);
      
      // Delay redirect to allow toast to show
      const timer = setTimeout(() => {
        setShouldRedirect(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading, isAuthenticated, user, error]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect if not admin
  if (user && user.role !== 'admin') {
    if (shouldRedirect) {
      return <Navigate to={fallback} replace />;
    }
    
    // Show loading/unauthorized state while waiting for redirect
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          <p className="text-red-600 font-medium">Bạn không có quyền truy cập. Đang chuyển hướng...</p>
        </div>
      </div>
    );
  }

  // Render children if authenticated and admin
  return <>{children}</>;
};

export default AdminRoute;