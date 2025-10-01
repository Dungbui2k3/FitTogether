import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const FitTogetherFooterLogo = () => {
  return (
    <div className="flex items-center space-x-3">
      <div className="relative">
        {/* Sports equipment icon effect */}
        <div className="w-8 h-8 relative transform rotate-12">
          {/* Front face */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">F</span>
          </div>
          {/* Top face */}
          <div className="absolute -top-1 -right-1 w-8 h-8 bg-gradient-to-br from-blue-400 to-green-400 rounded-lg transform -rotate-12 opacity-80 flex items-center justify-center">
            <span className="text-white font-bold text-sm">T</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-bold text-white">FitTogether</span>
        <span className="text-xs text-green-300 font-medium -mt-1">PHỤ KIỆN THỂ THAO</span>
      </div>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <FitTogetherFooterLogo />
            <p className="text-gray-300 leading-relaxed">
              Cung cấp phụ kiện thể thao chất lượng cao từ các thương hiệu uy tín hàng đầu thế giới với giá cả hợp lý nhất.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-6 w-6 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
              <Twitter className="h-6 w-6 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
              <Instagram className="h-6 w-6 text-gray-400 hover:text-pink-400 cursor-pointer transition-colors" />
              <Youtube className="h-6 w-6 text-gray-400 hover:text-red-400 cursor-pointer transition-colors" />
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Liên Kết Nhanh</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#home" className="hover:text-white transition-colors">Trang Chủ</a></li>
              <li><a href="#products" className="hover:text-white transition-colors">Sản Phẩm</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">Về Chúng Tôi</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Liên Hệ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Khuyến Mãi</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Dịch Vụ Khách Hàng</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Thông Tin Giao Hàng</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Đổi Trả</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Hướng Dẫn Chọn Size</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Câu Hỏi Thường Gặp</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Theo Dõi Đơn Hàng</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Thông Tin Liên Hệ</h3>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-green-400" />
                <span>info@fittogether.vn</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-green-400" />
                <span>+84 123 456 789</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-green-400" />
                <span>Hà Nội, Việt Nam</span>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="font-semibold mb-2">Đăng Ký Nhận Tin</h4>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Email của bạn"
                  className="flex-1 px-4 py-2 rounded-l-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-green-400 text-white"
                />
                <button className="bg-gradient-to-r from-green-600 to-blue-600 px-4 py-2 rounded-r-lg hover:from-green-700 hover:to-blue-700 transition-all">
                  Đăng Ký
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} FitTogether Phụ Kiện Thể Thao. Tất cả quyền được bảo lưu.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Chính Sách Bảo Mật</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Điều Khoản Dịch Vụ</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Chính Sách Cookie</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;