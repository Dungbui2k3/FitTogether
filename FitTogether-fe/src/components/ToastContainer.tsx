import React from 'react';
import Toast, { ToastType } from './Toast';

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  isVisible: boolean;
}

interface ToastContainerProps {
  toasts: ToastItem[];
  removeToast: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center';
}

const ToastContainer: React.FC<ToastContainerProps> = ({ 
  toasts, 
  removeToast, 
  position = 'top-right' 
}) => {
  if (toasts.length === 0) return null;

  const getContainerPositionClasses = () => {
    switch (position) {
      case 'top-right':
        return 'fixed top-4 right-4 z-50';
      case 'top-left':
        return 'fixed top-4 left-4 z-50';
      case 'bottom-right':
        return 'fixed bottom-4 right-4 z-50';
      case 'bottom-left':
        return 'fixed bottom-4 left-4 z-50';
      case 'top-center':
        return 'fixed top-4 left-1/2 transform -translate-x-1/2 z-50';
      default:
        return 'fixed top-4 right-4 z-50';
    }
  };

  return (
    <div className={`${getContainerPositionClasses()} space-y-2 max-w-md w-full`}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="transition-all duration-300 ease-in-out"
        >
          <Toast
            message={toast.message}
            type={toast.type}
            isVisible={toast.isVisible}
            onClose={() => removeToast(toast.id)}
            duration={0} // Duration handled by useToast hook
            position="top-right" // Position handled by container
          />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;