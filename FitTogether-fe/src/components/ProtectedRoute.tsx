import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, useToast } from '../hooks';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  fallback = '/login' 
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { error } = useToast();
  const location = useLocation();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  // Show unauthorized access notification when not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      error('🚫 Bạn cần đăng nhập để truy cập trang này!', 3000);
      
      // Delay redirect to allow toast to show
      const timer = setTimeout(() => {
        setShouldRedirect(true);
      }, 1500); // Wait 1.5 seconds before redirect
      
      return () => clearTimeout(timer);
    }
  }, [isLoading, isAuthenticated, error]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Đang kiểm tra đăng nhập...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated && !isLoading) {
    if (shouldRedirect) {
      return <Navigate to={fallback} state={{ from: location }} replace />;
    }
    
    // Show loading/unauthorized state while waiting for redirect
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          <p className="text-red-600 font-medium">Bạn không có quyền truy cập trang này! Vui lòng đăng nhập.</p>
        </div>
      </div>
    );
  }

  // Render children if authenticated
  return <>{children}</>;
};

export default ProtectedRoute;