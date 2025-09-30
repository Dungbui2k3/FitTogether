import React from 'react';

const PurchaseHistoryPage: React.FC = () => {
  const orders = [
    {
      id: 'FT-2025-001',
      date: '2025-01-15',
      total: 323.99,
      status: 'Delivered',
      items: [
        { name: 'Premium Treadmill', quantity: 1, price: 299.99 }
      ]
    },
    {
      id: 'FT-2025-002',
      date: '2025-01-10',
      total: 149.99,
      status: 'In Transit',
      items: [
        { name: 'Yoga Mat Set', quantity: 2, price: 74.99 }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'text-green-600 bg-green-100';
      case 'In Transit':
        return 'text-blue-600 bg-blue-100';
      case 'Processing':
        return 'text-yellow-600 bg-yellow-100';
      case 'Cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Purchase History</h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-600 mb-2">No Orders Yet</h2>
          <p className="text-gray-500">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold">Order #{order.id}</h2>
                  <p className="text-gray-600">Placed on {new Date(order.date).toLocaleDateString()}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Items Ordered</h3>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2">
                      <div>
                        <span className="font-medium">{item.name}</span>
                        <span className="text-gray-600 ml-2">x{item.quantity}</span>
                      </div>
                      <span className="font-medium">${item.price}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total: ${order.total}</span>
                  <div className="space-x-3">
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                      View Details
                    </button>
                    {order.status === 'Delivered' && (
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Reorder
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PurchaseHistoryPage;