import React from 'react';
import { Link } from 'react-router-dom';

const PaymentSuccessPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">
          Your payment has been processed successfully. Thank you for your purchase!
        </p>
        
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h2 className="font-semibold mb-2">Transaction Details</h2>
          <p className="text-sm text-gray-600">Transaction ID: TXN-FT-2025-001</p>
          <p className="text-sm text-gray-600">Amount Paid: $323.99</p>
          <p className="text-sm text-gray-600">Payment Method: Credit Card</p>
          <p className="text-sm text-gray-600">Date: {new Date().toLocaleDateString()}</p>
        </div>
        
        <p className="text-sm text-gray-600 mb-6">
          A receipt has been sent to your email address. Your order is now being processed.
        </p>
        
        <div className="space-y-3">
          <Link 
            to="/order-success" 
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 block"
          >
            View Order Details
          </Link>
          <Link 
            to="/" 
            className="w-full border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 block"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;