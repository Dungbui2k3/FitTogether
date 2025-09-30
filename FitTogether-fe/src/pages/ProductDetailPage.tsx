import React from 'react';
import { useParams } from 'react-router-dom';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-100 rounded-lg p-8 h-96 flex items-center justify-center">
          <span className="text-gray-500 text-xl">Product Image</span>
        </div>
        
        <div>
          <h1 className="text-3xl font-bold mb-4">Fitness Equipment #{id}</h1>
          <p className="text-2xl font-semibold text-green-600 mb-4">$299.99</p>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-600">
              High-quality fitness equipment designed to help you achieve your fitness goals. 
              This product features durable construction and modern design.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Features</h3>
            <ul className="list-disc list-inside text-gray-600">
              <li>Durable construction</li>
              <li>Modern design</li>
              <li>Easy to use</li>
              <li>Space efficient</li>
            </ul>
          </div>
          
          <div className="flex gap-4">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
              Add to Cart
            </button>
            <button className="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50">
              Add to Wishlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;