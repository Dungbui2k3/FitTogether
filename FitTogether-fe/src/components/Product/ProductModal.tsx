import React, { useState } from 'react';
import { X, RotateCcw, ZoomIn, ZoomOut, RotateCw, Move } from 'lucide-react';
import ProductImage from '../ProductImage';

interface Product {
  id: number;
  name: string;
  location: string;
  price: number;
  image: string;
  description: string;
  rating: number;
  modelType: string;
}

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose }) => {
  const [autoRotate, setAutoRotate] = useState(false);

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Interactive 3D Model Viewer</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl aspect-square">
                <ProductImage productType="equipment" className="w-full h-full" />
                
                <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-3 py-2 rounded-lg text-sm">
                  <div className="font-semibold">{product.name}</div>
                  <div className="text-xs opacity-90">Hình ảnh sản phẩm</div>
                </div>
                
                <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
                  <button 
                    onClick={() => setAutoRotate(!autoRotate)}
                    className={`p-2 rounded-lg transition-colors ${
                      autoRotate 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white bg-opacity-90 text-gray-800 hover:bg-opacity-100'
                    }`}
                    title="Toggle Auto Rotate"
                  >
                    <RotateCw className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Move className="h-5 w-5 mr-2 text-blue-600" />
                  3D Controls
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <RotateCcw className="h-4 w-4 mr-2 text-blue-600" />
                      <span>Click & drag to rotate</span>
                    </div>
                    <div className="flex items-center">
                      <ZoomIn className="h-4 w-4 mr-2 text-green-600" />
                      <span>Scroll to zoom in/out</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Move className="h-4 w-4 mr-2 text-purple-600" />
                      <span>Right-click & drag to pan</span>
                    </div>
                    <div className="flex items-center">
                      <RotateCw className="h-4 w-4 mr-2 text-orange-600" />
                      <span>Double-click to reset view</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-3xl font-bold text-gray-900">{product.name}</h3>
                <p className="text-lg text-gray-600 mt-1">{product.location}</p>
                <div className="flex items-center mt-2">
                  <div className="flex text-yellow-400 mr-2">
                    {'★'.repeat(Math.floor(product.rating))}
                  </div>
                  <span className="text-sm text-gray-600">({product.rating}/5.0)</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-700 leading-relaxed">{product.description}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">3D Printing Specifications</h4>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Material: Premium PLA+ plastic</li>
                    <li>• Layer Height: 0.1mm (Ultra High Detail)</li>
                    <li>• Dimensions: 15cm x 10cm x 8cm</li>
                    <li>• Print Time: 12-18 hours</li>
                    <li>• Finish: Smooth matte surface with optional painting</li>
                    <li>• Support Removal: Professional post-processing included</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">What's Included</h4>
                  <ul className="text-gray-700 space-y-1">
                    <li>• 3D printed landmark model</li>
                    <li>• Display base with engraved nameplate</li>
                    <li>• Certificate of authenticity</li>
                    <li>• Care instructions</li>
                    <li>• Premium gift packaging</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Shipping & Delivery</h4>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Free worldwide shipping on orders over $25</li>
                    <li>• 7-14 business days delivery</li>
                    <li>• Secure bubble wrap packaging</li>
                    <li>• Full tracking and insurance included</li>
                    <li>• 30-day money-back guarantee</li>
                  </ul>
                </div>
              </div>
              
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-3xl font-bold text-blue-600">${product.price}</span>
                    <div className="text-sm text-gray-500 line-through ml-2">$49.99</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-green-600 font-medium flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                      In Stock - Ready to Print
                    </div>
                    <div className="text-xs text-gray-600">Ships within 3-5 business days</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <button className="border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                      Add to Wishlist
                    </button>
                    <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all">
                      Add to Cart
                    </button>
                  </div>
                  
                  <button className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-pink-600 transition-all">
                    Buy Now - Express Checkout
                  </button>
                </div>
                
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="text-sm text-yellow-800">
                    <strong>Limited Time:</strong> Free custom engraving on the display base! 
                    Add your personal message during checkout.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;