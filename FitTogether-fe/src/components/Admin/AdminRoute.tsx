import React from 'react';
import { Navigate } from 'react-router-dom';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  // Mock admin check - replace with real authentication and authorization logic
  const isAuthenticated = false; // This should come from your auth context/state
  const isAdmin = false; // This should check if user has admin role
  
  if (!isAuthenticated) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" replace />;
  }
  
  if (!isAdmin) {
    // Redirect to home page if not admin
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;