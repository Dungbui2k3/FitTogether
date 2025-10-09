import React from 'react';
import { Field } from '../../types/field';
import { MapPin, Phone, Users, Clock, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MyFieldsCardProps {
  field: Field;
}

const MyFieldsCard: React.FC<MyFieldsCardProps> = ({ field }) => {
  const getPlaceholderImage = (fieldName: string) => {
    const name = fieldName.toLowerCase();
    if (name.includes("bóng đá") || name.includes("football")) {
      return "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=250&fit=crop&crop=center";
    } else if (name.includes("cầu lông") || name.includes("badminton")) {
      return "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=250&fit=crop&crop=center";
    } else if (name.includes("tennis")) {
      return "https://images.unsplash.com/photo-1542144582-1ba00456b5e3?w=400&h=250&fit=crop&crop=center";
    } else if (name.includes("bóng rổ") || name.includes("basketball")) {
      return "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=250&fit=crop&crop=center";
    } else {
      return "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop&crop=center";
    }
  };

  const fieldImage = field.images && field.images.length > 0 
    ? field.images[0] 
    : getPlaceholderImage(field.name);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Field Image */}
      <div className="relative h-48">
        <img
          src={fieldImage}
          alt={field.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4">
          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            Hoạt động
          </span>
        </div>
      </div>

      {/* Field Info */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800 line-clamp-2">
            {field.name}
          </h3>
        </div>

        {/* Address */}
        <div className="flex items-center mb-3">
          <MapPin className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
          <p className="text-gray-600 text-sm line-clamp-1">{field.address}</p>
        </div>

        {/* Phone */}
        <div className="flex items-center mb-3">
          <Phone className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
          <p className="text-gray-600 text-sm">{field.phone}</p>
        </div>

        {/* SubFields Count */}
        <div className="flex items-center mb-4">
          <Users className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
          <p className="text-gray-600 text-sm">
            {field.subFieldsCount || 0} sân con
          </p>
        </div>

        {/* Time Slots */}
        {field.slots && field.slots.length > 0 && (
          <div className="flex items-center mb-4">
            <Clock className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
            <div className="flex flex-wrap gap-1">
              {field.slots.slice(0, 3).map((slot, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs"
                >
                  {slot}
                </span>
              ))}
              {field.slots.length > 3 && (
                <span className="text-gray-500 text-xs">
                  +{field.slots.length - 3} khác
                </span>
              )}
            </div>
          </div>
        )}

        {/* Facilities */}
        {field.facilities && field.facilities.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {field.facilities.slice(0, 3).map((facility, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                >
                  {facility}
                </span>
              ))}
              {field.facilities.length > 3 && (
                <span className="text-gray-500 text-xs">
                  +{field.facilities.length - 3} khác
                </span>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-2">
          <Link
            to={`/field-owner/field/${field.id}`}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded text-center text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <Eye className="h-4 w-4 mr-2" />
            Xem Chi Tiết
          </Link>
          <Link
            to={`/field/${field.id}`}
            className="flex-1 bg-gray-600 text-white py-2 px-4 rounded text-center text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            Đặt Sân
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MyFieldsCard;
