import React from 'react';
import { Link } from 'react-router-dom';

const PaymentCancelPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-red-600 mb-4">Payment Cancelled</h1>
        <p className="text-gray-600 mb-6">
          Your payment was cancelled and no charges have been made to your account.
        </p>
        
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h2 className="font-semibold mb-2">What happened?</h2>
          <ul className="text-sm text-gray-600 text-left space-y-1">
            <li>• Payment was cancelled by user</li>
            <li>• No funds have been charged</li>
            <li>• Your cart items are still saved</li>
            <li>• You can try payment again anytime</li>
          </ul>
        </div>
        
        <p className="text-sm text-gray-600 mb-6">
          If you experienced an issue during checkout, please contact our support team.
        </p>
        
        <div className="space-y-3">
          <Link 
            to="/checkout" 
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 block"
          >
            Try Payment Again
          </Link>
          <Link 
            to="/cart" 
            className="w-full border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 block"
          >
            Back to Cart
          </Link>
          <Link 
            to="/" 
            className="w-full text-gray-600 hover:text-gray-800 block"
          >
            Continue Shopping
          </Link>
        </div>
        
        <div className="mt-8 pt-6 border-t">
          <p className="text-sm text-gray-500">Need help?</p>
          <Link to="/contact" className="text-blue-600 hover:underline text-sm">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelPage;