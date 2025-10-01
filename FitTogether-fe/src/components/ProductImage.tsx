import React from 'react';

interface ProductImageProps {
  productType: string;
  imageUrl?: string;
  className?: string;
}

const ProductImage: React.FC<ProductImageProps> = ({ productType, imageUrl, className = "" }) => {
  // Placeholder images cho các loại phụ kiện thể thao
  const getDefaultImage = (type: string) => {
    const imageMap: { [key: string]: string } = {
      'shoes': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
      'equipment': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
      'clothing': 'https://images.unsplash.com/photo-1556302332-4d3b57b11f75?w=400&h=400&fit=crop',
      'accessories': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
      'fitness': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=400&fit=crop',
      'outdoor': 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop',
      'sports-gear': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=400&fit=crop',
      'ball-sports': 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5fc?w=400&h=400&fit=crop'
    };
    return imageMap[type] || imageMap['equipment'];
  };

  return (
    <div className={`w-full h-full rounded-lg overflow-hidden bg-gray-100 ${className}`}>
      <img 
        src={imageUrl || getDefaultImage(productType)}
        alt={`Phụ kiện thể thao ${productType}`}
        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
      />
    </div>
  );
};

export default ProductImage;