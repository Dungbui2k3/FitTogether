import React, { useState } from 'react';
import { MapPin, Phone, Clock, Users, Star } from 'lucide-react';
import type { Field } from '../../types/field';

interface FieldCardProps {
  field: Field;
  onClick?: () => void;
}

const FieldCard: React.FC<FieldCardProps> = ({ field, onClick }) => {
  const [imageError, setImageError] = useState(false);
  
  // Default placeholder images for different types of sports fields
  const getPlaceholderImage = (fieldName: string) => {
    const name = fieldName.toLowerCase();
    if (name.includes('bóng đá') || name.includes('football')) {
      return 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=250&fit=crop&crop=center';
    } else if (name.includes('cầu lông') || name.includes('badminton')) {
      return 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=250&fit=crop&crop=center';
    } else if (name.includes('tennis')) {
      return 'https://images.unsplash.com/photo-1542144582-1ba00456b5e3?w=400&h=250&fit=crop&crop=center';
    } else if (name.includes('bóng rổ') || name.includes('basketball')) {
      return 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=250&fit=crop&crop=center';
    } else {
      return 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop&crop=center';
    }
  };

  const fieldImage = field.images && field.images.length > 0 && !imageError 
    ? field.images[0] 
    : getPlaceholderImage(field.name);

  return (
    <div 
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1"
      onClick={onClick}
    >
      {/* Field Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={fieldImage}
          alt={field.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={() => setImageError(true)}
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        
        {/* Status badge */}
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
            field.isDeleted 
              ? 'bg-red-500/90 text-white' 
              : 'bg-green-500/90 text-white'
          }`}>
            {field.isDeleted ? 'Tạm đóng' : 'Hoạt động'}
          </span>
        </div>

        {/* Field name overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-bold text-white mb-1">{field.name}</h3>
          <div className="flex items-center space-x-2 text-white/90">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{field.address}</span>
          </div>
        </div>
      </div>

      {/* Nội dung chính */}
      <div className="p-6">
        {/* Thông tin liên hệ */}
        <div className="flex items-center space-x-2 mb-4">
          <Phone className="h-5 w-5 text-blue-600" />
          <span className="text-gray-700 font-medium">{field.phone}</span>
        </div>

        {/* Mô tả */}
        {field.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {field.description}
          </p>
        )}

        {/* Tiện ích */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
            <Star className="h-4 w-4 text-yellow-500 mr-1" />
            Tiện ích nổi bật:
          </h4>
          <div className="space-y-1">
            {field.facilities.slice(0, 3).map((facility, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">{facility}</span>
              </div>
            ))}
            {field.facilities.length > 3 && (
              <div className="text-xs text-blue-600 font-medium">
                +{field.facilities.length - 3} tiện ích khác
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>Mở cửa hàng ngày</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Users className="h-4 w-4" />
            <span>Đặt sân ngay</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default FieldCard;
