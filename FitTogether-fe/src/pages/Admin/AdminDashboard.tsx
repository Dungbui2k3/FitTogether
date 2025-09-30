import React from 'react';

const AdminDashboard: React.FC = () => {
  const stats = [
    { title: 'Total Users', value: '1,234', icon: '👥', change: '+12%' },
    { title: 'Total Orders', value: '567', icon: '📦', change: '+8%' },
    { title: 'Total Products', value: '89', icon: '🏋️', change: '+3%' },
    { title: 'Revenue', value: '$45,678', icon: '💰', change: '+15%' }
  ];

  const recentOrders = [
    { id: 'FT-001', customer: 'John Doe', amount: '$299.99', status: 'Shipped' },
    { id: 'FT-002', customer: 'Jane Smith', amount: '$149.99', status: 'Processing' },
    { id: 'FT-003', customer: 'Mike Johnson', amount: '$599.99', status: 'Delivered' },
    { id: 'FT-004', customer: 'Sarah Wilson', amount: '$79.99', status: 'Pending' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className="text-3xl">{stat.icon}</div>
            </div>
            <div className="mt-4">
              <span className="text-green-600 text-sm font-medium">{stat.change}</span>
              <span className="text-gray-600 text-sm"> vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Order #{order.id}</p>
                  <p className="text-sm text-gray-600">{order.customer}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{order.amount}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50">
              <div className="font-medium">Add New Product</div>
              <div className="text-sm text-gray-600">Create a new fitness equipment listing</div>
            </button>
            <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50">
              <div className="font-medium">Process Orders</div>
              <div className="text-sm text-gray-600">Review and update order status</div>
            </button>
            <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50">
              <div className="font-medium">Manage Categories</div>
              <div className="text-sm text-gray-600">Organize product categories</div>
            </button>
            <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50">
              <div className="font-medium">View Analytics</div>
              <div className="text-sm text-gray-600">Check detailed performance metrics</div>
            </button>
          </div>
        </div>
      </div>

      {/* Charts placeholder */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Sales Overview</h2>
        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <span className="text-gray-500">Chart will be displayed here</span>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;