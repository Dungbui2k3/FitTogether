import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/Home/Hero';
import ProductGrid from '../components/Product/ProductGrid';
import About from '../components/Home/About';
import Testimonials from '../components/Home/Testimonials';
import Contact from '../components/Home/Contact';
import { useToast } from '../hooks';
import ToastContainer from '../components/ToastContainer';

const HomePage: React.FC = () => {
  const location = useLocation();
  const { success, toasts, removeToast } = useToast();

  useEffect(() => {
    const state = location.state as any;
    
    if (state?.loginSuccess) {
      success('🎉 Đăng nhập thành công!', 2000);
      window.history.replaceState({}, document.title);
    }
    
    if (state?.registerSuccess) {
      success('🎊 Đăng ký thành công! Chào mừng bạn đến với FitTogether!', 2000);
      window.history.replaceState({}, document.title);
    }
  }, [location.state, success]);

  return (
    <div>
      <Hero />
      <ProductGrid />
      <About />
      <Testimonials />
      <Contact />
      
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} position="top-right" />
    </div>
  );
};

export default HomePage;