import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { XCircle, AlertTriangle, ArrowRight, Home, ShoppingBag } from "lucide-react";
import { useToast } from "../../hooks";

const PaymentCancelPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { success } = useToast();
  
  const [orderInfo] = useState({
    orderCode: searchParams.get('orderCode') || '',
    id: searchParams.get('id') || '',
    status: searchParams.get('status') || '',
    code: searchParams.get('code') || '',
  });

  useEffect(() => {
    // Show info message
    success("Payment was cancelled. You can try again or choose a different payment method.");
  }, [success]);


  const handleContinueShopping = () => {
    navigate("/");
  };

  const handleViewOrders = () => {
    navigate("/purchase-history");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        {/* Cancel Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-4">
              <XCircle className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Payment Cancelled
            </h1>
            <p className="text-orange-100 text-base">
              Your payment was cancelled or failed
            </p>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            {/* Order Details */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-orange-600" />
                Payment Information
              </h2>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center py-1.5 border-b border-gray-200">
                  <span className="text-gray-600 text-sm font-medium">Order Code:</span>
                  <span className="font-bold text-gray-900 text-sm">{orderInfo.orderCode}</span>
                </div>
                
                <div className="flex justify-between items-center py-1.5 border-b border-gray-200">
                  <span className="text-gray-600 text-sm font-medium">Payment ID:</span>
                  <span className="font-mono text-xs text-gray-700">{orderInfo.id}</span>
                </div>
                
                <div className="flex justify-between items-center py-1.5 border-b border-gray-200">
                  <span className="text-gray-600 text-sm font-medium">Error Code:</span>
                  <span className="font-mono text-xs text-red-600">{orderInfo.code}</span>
                </div>
                
                <div className="flex justify-between items-center py-1.5">
                  <span className="text-gray-600 text-sm font-medium">Status:</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <XCircle className="h-3 w-3 mr-1" />
                    {orderInfo.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Reasons & Solutions */}
            <div className="bg-yellow-50 rounded-xl p-4 mb-6">
              <h3 className="text-base font-bold text-gray-900 mb-3">What happened?</h3>
              <div className="space-y-2 text-gray-700 text-sm">
                <div className="flex items-start">
                  <div className="w-5 h-5 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-2 mt-0.5">!</div>
                  <p>You cancelled the payment process</p>
                </div>
                <div className="flex items-start">
                  <div className="w-5 h-5 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-2 mt-0.5">!</div>
                  <p>Payment was declined by your bank</p>
                </div>
                <div className="flex items-start">
                  <div className="w-5 h-5 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-2 mt-0.5">!</div>
                  <p>Network connection was interrupted</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleViewOrders}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-200 flex items-center justify-center group text-sm"
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  View My Orders
                  <ArrowRight className="h-3 w-3 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button
                  onClick={handleContinueShopping}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-200 flex items-center justify-center group text-sm"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Continue Shopping
                  <ArrowRight className="h-3 w-3 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Message */}
        <div className="text-center mt-6">
          <p className="text-gray-600 text-sm">
            Don't worry! Your order is still saved and you can complete the payment anytime.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelPage;
