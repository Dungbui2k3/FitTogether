import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">FitTogether - Fitness Equipment Store</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Premium Equipment</h2>
          <p className="text-gray-600">Discover our collection of high-quality fitness equipment for your home gym.</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Expert Guidance</h2>
          <p className="text-gray-600">Get professional advice on choosing the right equipment for your fitness goals.</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Fast Delivery</h2>
          <p className="text-gray-600">Quick and secure delivery to your doorstep with professional installation.</p>
        </div>
      </div>
      
      <div className="text-center mt-12">
        <h2 className="text-3xl font-bold mb-6">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Product cards will be added here */}
          <div className="bg-gray-100 rounded-lg p-4 h-64 flex items-center justify-center">
            <span className="text-gray-500">Product 1</span>
          </div>
          <div className="bg-gray-100 rounded-lg p-4 h-64 flex items-center justify-center">
            <span className="text-gray-500">Product 2</span>
          </div>
          <div className="bg-gray-100 rounded-lg p-4 h-64 flex items-center justify-center">
            <span className="text-gray-500">Product 3</span>
          </div>
          <div className="bg-gray-100 rounded-lg p-4 h-64 flex items-center justify-center">
            <span className="text-gray-500">Product 4</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;