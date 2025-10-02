import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, ShoppingCart } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useToast } from '../../hooks';
import type { Product } from '../../types/product';

interface ProductCardProps {
  product: Product;
  onView3D?: (product: Product) => void; // Made optional since we don't use it
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();
  const { success, error: showError } = useToast();

  const handleProductClick = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    console.log('Navigating to product detail page:', product.id);
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!product.price) {
      showError("Price not available for this product");
      return;
    }

    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.urlImgs?.[0],
    });

    success(`${product.name} added to cart!`);
  };

  return (
    <div 
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className="relative overflow-hidden cursor-pointer"
        onClick={(e) => handleProductClick(e)}
      >
        <img 
          src={product.urlImgs?.[0] || "/placeholder-image.svg"} 
          alt={product.name}
          className="w-full h-64 object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder-image.svg";
          }}
        />
        <div className={`absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleProductClick(e);
            }}
            className="bg-blue-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2 z-10"
          >
            <Eye className="h-5 w-5" />
            <span>View detail</span>
          </button>
        </div>
        <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
          {product.category?.name || 'Uncategorized'}
        </div>
        <div className="absolute top-4 right-4 flex text-yellow-400 text-sm">
          {'★'.repeat(4)} {/* Default rating since we don't have rating in new API */}
        </div>
      </div>
      
      <div 
        className="p-6 cursor-pointer" 
        onClick={(e) => handleProductClick(e)}
      >
        <div className="space-y-2 mb-4 h-28">
          <h3 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm">{product.nation}</p>
          <p className="text-gray-700 text-sm leading-relaxed">{product.description}</p>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-blue-600">
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
              }).format(product.price)}
            </span>
            <span className="text-sm text-gray-500">
              Quantity: {product.quantity}
            </span>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleProductClick(e);
              }}
              className="p-2 border border-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              title="View detail"
            >
              <Eye className="h-5 w-5 text-blue-600" />
            </button>
            <button 
              onClick={handleAddToCart}
              disabled={isInCart(product.id)}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-1 ${
                isInCart(product.id)
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <ShoppingCart className="h-4 w-4" />
              <span>{isInCart(product.id) ? 'Added' : 'Add'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;