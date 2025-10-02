import React from 'react';
import { useToast } from '../contexts/ToastContext';
import ToastContainer from './ToastContainer';

const GlobalToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  return (
    <ToastContainer 
      toasts={toasts} 
      removeToast={removeToast} 
      position="top-right" 
    />
  );
};

export default GlobalToastContainer;