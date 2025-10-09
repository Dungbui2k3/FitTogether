import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, useToast } from '../hooks';

interface FieldOwnerRouteProps {
  children: React.ReactNode;
  fallback?: string;
}

const FieldOwnerRoute: React.FC<FieldOwnerRouteProps> = ({ 
  children, 
  fallback = '/login' 
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { error } = useToast();
  const location = useLocation();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  // Check if user has field owner role
  const isFieldOwner = user?.role === 'field_owner';

  // Show unauthorized access notification when not authenticated or not field owner
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      error('🚫 Bạn cần đăng nhập để truy cập trang này!', 3000);
      
      // Delay redirect to allow toast to show
      const timer = setTimeout(() => {
        setShouldRedirect(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    } else if (!isLoading && isAuthenticated && user && !isFieldOwner) {
      error('🚫 Bạn không có quyền truy cập trang quản lý sân thể thao!', 3000);
      
      // Delay redirect to allow toast to show
      const timer = setTimeout(() => {
        setShouldRedirect(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading, isAuthenticated, user, isFieldOwner, error]);

  // Show loading state while checking authentication or loading user data
  if (isLoading || (isAuthenticated && !user)) {
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
  if (!isAuthenticated && !isLoading) {
    if (shouldRedirect) {
      return <Navigate to={fallback} state={{ from: location }} replace />;
    }
    
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          <p className="text-red-600 font-medium">Bạn không có quyền truy cập trang này! Vui lòng đăng nhập.</p>
        </div>
      </div>
    );
  }

  // Redirect if authenticated but not field owner
  if (isAuthenticated && user && !isFieldOwner && !isLoading) {
    if (shouldRedirect) {
      return <Navigate to="/" state={{ from: location }} replace />;
    }
    
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          <p className="text-orange-600 font-medium">Bạn không có quyền quản lý sân thể thao!</p>
        </div>
      </div>
    );
  }

  // Render children if authenticated and has field owner role
  return <>{children}</>;
};

export default FieldOwnerRoute;
