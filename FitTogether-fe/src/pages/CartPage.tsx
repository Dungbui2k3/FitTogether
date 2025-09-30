import React from 'react';
import { Link } from 'react-router-dom';

const CartPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Cart Items</h2>
            
            {/* Sample cart item */}
            <div className="border-b pb-4 mb-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">Img</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Premium Treadmill</h3>
                  <p className="text-gray-600">High-quality fitness equipment</p>
                  <p className="text-green-600 font-semibold">$299.99</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="w-8 h-8 border rounded-lg flex items-center justify-center">-</button>
                  <span className="w-8 text-center">1</span>
                  <button className="w-8 h-8 border rounded-lg flex items-center justify-center">+</button>
                </div>
                <button className="text-red-500 hover:text-red-700">Remove</button>
              </div>
            </div>
            
            <div className="text-center py-8 text-gray-500">
              <p>Your cart is empty</p>
              <Link to="/" className="text-blue-600 hover:underline">Continue Shopping</Link>
            </div>
          </div>
        </div>
        
        <div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>$0.00</span>
              </div>
              <hr />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total:</span>
                <span>$0.00</span>
              </div>
            </div>
            
            <Link 
              to="/checkout" 
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 block text-center"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;