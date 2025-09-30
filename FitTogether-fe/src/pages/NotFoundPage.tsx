import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-200">404</h1>
        </div>
        
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Page Not Found</h2>
          <p className="text-gray-600 text-lg">
            Sorry, the page you are looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link 
            to="/" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back Home
          </Link>
          
          <div className="text-sm text-gray-500">
            <p>Or try one of these helpful links:</p>
            <div className="flex justify-center space-x-4 mt-2">
              <Link to="/" className="text-blue-600 hover:underline">Home</Link>
              <Link to="/cart" className="text-blue-600 hover:underline">Cart</Link>
              <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;