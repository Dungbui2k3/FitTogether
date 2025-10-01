import React, { useState, useEffect } from "react";
import {
  Package,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  X,
  User,
  Calendar,
} from "lucide-react";
import { Order } from "../../types/order";
import { orderService } from "../../services";
import { useToast } from "../../hooks";
const AdminOrderManagement: React.FC = () => {
  const { success, error: showError } = useToast();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [limit] = useState(10);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [currentPage, statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const status = statusFilter === "all" ? undefined : statusFilter;
      const response = await orderService.findAllOrders(currentPage, limit, status);
      
      if (response.success) {
        setOrders(response.data.orders);
        setTotalOrders(response.data.total);
        setTotalPages(Math.ceil(response.data.total / limit));
      } else {
        showError(response.message || "Failed to load orders");
        setOrders([]);
      }
    } catch (error) {
      showError("Failed to load orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: 'pending' | 'success' | 'cancel') => {
    try {
      const response = await orderService.updateOrderStatus(orderId, newStatus);
      if (response.success) {
        success(`Order status updated to ${newStatus}`);
        fetchOrders();
      } else {
        showError(response.message || "Failed to update order status");
      }
    } catch (error) {
      showError("Failed to update order status");
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const filteredOrders = orders.filter(order =>
    order.orderCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.userId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.userId.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const truncateItems = (items: any[], maxLength: number = 18) => {
    if (!items || items.length === 0) return 'No items';
    
    const itemsText = items.map(item => item.productId.name).join(', ');
    if (itemsText.length <= maxLength) {
      return itemsText;
    }
    
    // Tìm vị trí cắt tốt nhất (tại dấu phẩy)
    let cutIndex = maxLength;
    for (let i = maxLength; i >= 0; i--) {
      if (itemsText[i] === ',') {
        cutIndex = i;
        break;
      }
    }
    
    return itemsText.substring(0, cutIndex) + '...';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "success":
        return "text-green-600 bg-green-100";
      case "cancel":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Processing";
      case "success":
        return "Completed";
      case "cancel":
        return "Cancelled";
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "success":
        return <CheckCircle className="h-4 w-4" />;
      case "cancel":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-4">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
              <p className="text-gray-600">Manage and track all orders</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                 placeholder="Search by order code, customer name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="all">All Status</option>
                <option value="pending">Processing</option>
                <option value="success">Completed</option>
                <option value="cancel">Cancelled</option>
              </select>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center">
              <span className="text-sm text-gray-600">
                Total: {totalOrders} orders
              </span>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-500">No orders match your current filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th> */}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {order.orderCode}
                          </div>
                        </div>
                      </td>
                       <td className="px-6 py-4 whitespace-nowrap">
                         <div>
                           <div className="text-sm font-medium text-gray-900">
                             {order.userId.name}
                           </div>
                           <div className="text-sm text-gray-500">
                             {order.userId.email}
                           </div>
                         </div>
                       </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                        </div>
                        <div className="text-sm text-gray-500 w-30">
                          {truncateItems(order.items)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatPrice(order.totalAmount)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1">{getStatusText(order.status)}</span>
                          </span>
                        </div>
                      </td>
                        {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(order.orderDate)}
                        </td> */}
                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                         <div className="flex items-center space-x-2">
                           <button
                             onClick={() => handleViewOrder(order)}
                             className="group relative px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all duration-200 flex items-center space-x-1.5 shadow-sm hover:shadow-md"
                           >
                             <Eye className="h-3.5 w-3.5" />
                             <span className="text-xs font-medium">View</span>
                           </button>
                           
                           {order.status === 'pending' && (
                             <>
                               <button
                                 onClick={() => handleStatusChange(order._id, 'success')}
                                 className="group relative px-3 py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-all duration-200 flex items-center space-x-1.5 shadow-sm hover:shadow-md"
                               >
                                 <CheckCircle className="h-3.5 w-3.5" />
                                 <span className="text-xs font-medium">Complete</span>
                               </button>
                               <button
                                 onClick={() => handleStatusChange(order._id, 'cancel')}
                                 className="group relative px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all duration-200 flex items-center space-x-1.5 shadow-sm hover:shadow-md"
                               >
                                 <XCircle className="h-3.5 w-3.5" />
                                 <span className="text-xs font-medium">Cancel</span>
                               </button>
                             </>
                           )}
                         </div>
                       </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-700">
              Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, totalOrders)} of {totalOrders} results
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
         )}
       </div>

       {/* Order Detail Modal */}
       {isModalOpen && selectedOrder && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
           <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
             {/* Modal Header */}
             <div className="flex items-center justify-between p-6 border-b border-gray-200">
               <div className="flex items-center space-x-3">
                 <div className="p-2 bg-blue-100 rounded-lg">
                   <Package className="h-6 w-6 text-blue-600" />
                 </div>
                 <div>
                   <h2 className="text-2xl font-bold text-gray-900">
                     Order Details
                   </h2>
                   <p className="text-gray-600">{selectedOrder.orderCode}</p>
                 </div>
               </div>
               <button
                 onClick={closeModal}
                 className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
               >
                 <X className="h-6 w-6 text-gray-500" />
               </button>
             </div>

             {/* Modal Content */}
             <div className="p-6 space-y-6">
               {/* Order Status */}
               <div className="flex items-center justify-between">
                 <div className="flex items-center space-x-3">
                   <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                     {getStatusIcon(selectedOrder.status)}
                     <span className="ml-2">{getStatusText(selectedOrder.status)}</span>
                   </span>
                 </div>
                 <div className="text-right">
                   <p className="text-2xl font-bold text-gray-900">
                     {formatPrice(selectedOrder.totalAmount)}
                   </p>
                   <p className="text-sm text-gray-500">
                     Order Date: {formatDate(selectedOrder.orderDate)}
                   </p>
                 </div>
               </div>

               {/* Customer Information */}
               <div className="bg-gray-50 rounded-lg p-4">
                 <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                   <User className="h-5 w-5 mr-2" />
                   Customer Information
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                     <p className="text-sm text-gray-500">Name</p>
                     <p className="font-medium text-gray-900">{selectedOrder.userId.name}</p>
                   </div>
                   <div>
                     <p className="text-sm text-gray-500">Email</p>
                     <p className="font-medium text-gray-900">{selectedOrder.userId.email}</p>
                   </div>
                   <div>
                     <p className="text-sm text-gray-500">Customer ID</p>
                     <p className="font-medium text-gray-900">{selectedOrder.userId._id}</p>
                   </div>
                 </div>
               </div>

               {/* Order Items */}
               <div>
                 <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                   <Package className="h-5 w-5 mr-2" />
                   Order Items ({selectedOrder.items.length})
                 </h3>
                 <div className="space-y-3">
                   {selectedOrder.items.map((item, index) => (
                     <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                       <div className="flex items-center justify-between">
                         <div className="flex-1">
                           <h4 className="font-medium text-gray-900">
                             {item.productId.name}
                           </h4>
                           <div className="flex items-center space-x-4 mt-2">
                             <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                               item.type === "digital"
                                 ? "bg-blue-100 text-blue-800"
                                 : "bg-green-100 text-green-800"
                             }`}>
                               {item.type === "digital" ? "Digital" : "Physical"}
                             </span>
                             <span className="text-sm text-gray-500">
                               Quantity: {item.quantity}
                             </span>
                           </div>
                         </div>
                         <div className="text-right">
                           <p className="font-semibold text-gray-900">
                             {formatPrice(item.price * item.quantity)}
                           </p>
                           <p className="text-sm text-gray-500">
                             {formatPrice(item.price)} each
                           </p>
                         </div>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>

               {/* Order Notes */}
               {selectedOrder.notes && (
                 <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                   <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                     <Calendar className="h-5 w-5 mr-2" />
                     Order Notes
                   </h3>
                   <p className="text-gray-700">{selectedOrder.notes}</p>
                 </div>
               )}

               {/* Order Summary */}
               <div className="bg-gray-50 rounded-lg p-4">
                 <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Summary</h3>
                 <div className="space-y-2">
                   <div className="flex justify-between">
                     <span className="text-gray-600">Items ({selectedOrder.items.length})</span>
                     <span className="font-medium">
                       {formatPrice(selectedOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0))}
                     </span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-gray-600">Shipping</span>
                     <span className="font-medium">
                       {selectedOrder.items.some(item => item.type === 'physical') 
                         ? formatPrice(30000) 
                         : 'Free'
                       }
                     </span>
                   </div>
                   <div className="border-t border-gray-300 pt-2">
                     <div className="flex justify-between">
                       <span className="text-lg font-bold text-gray-900">Total</span>
                       <span className="text-xl font-bold text-blue-600">
                         {formatPrice(selectedOrder.totalAmount)}
                       </span>
                     </div>
                   </div>
                 </div>
               </div>
             </div>

             {/* Modal Footer */}
             <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
               <div className="flex items-center justify-between">
                 {/* Order Status Info */}
                 <div className="flex items-center space-x-4">
                   <div className="flex items-center space-x-2">
                     <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                     <span className="text-sm text-gray-600">
                       Order ID: {selectedOrder._id.slice(-8).toUpperCase()}
                     </span>
                   </div>
                   <div className="flex items-center space-x-2">
                     <Calendar className="h-4 w-4 text-gray-400" />
                     <span className="text-sm text-gray-600">
                       Created: {formatDate(selectedOrder.createdAt)}
                     </span>
                   </div>
                 </div>

                 {/* Action Buttons */}
                 <div className="flex items-center space-x-3">
                   {selectedOrder.status === 'pending' && (
                     <>
                       <button
                         onClick={() => {
                           handleStatusChange(selectedOrder._id, 'success');
                           closeModal();
                         }}
                         className="group relative px-6 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2"
                       >
                         <CheckCircle className="h-4 w-4" />
                         <span className="font-medium">Complete Order</span>
                         <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-xl transition-opacity duration-200"></div>
                       </button>
                       <button
                         onClick={() => {
                           handleStatusChange(selectedOrder._id, 'cancel');
                           closeModal();
                         }}
                         className="group relative px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2"
                       >
                         <XCircle className="h-4 w-4" />
                         <span className="font-medium">Cancel Order</span>
                         <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-xl transition-opacity duration-200"></div>
                       </button>
                     </>
                   )}
                   
                   <div className="h-6 w-px bg-gray-300"></div>
                   
                   <button
                     onClick={closeModal}
                     className="group relative px-6 py-2.5 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 flex items-center space-x-2"
                   >
                     <X className="h-4 w-4" />
                     <span className="font-medium">Close</span>
                   </button>
                 </div>
               </div>
             </div>
           </div>
         </div>
       )}
     </div>
   );
 };
 
 export default AdminOrderManagement;
