/* eslint-disable react-hooks/immutability */
/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion';
import { ShoppingBag, User, Phone, MapPin, CreditCard, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

import adminApi from '../utils/adminApi';
import { normalizeOrdersData } from '../utils/normalizeData';

const AdminOrders = () => {
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const result = await adminApi.getAllOrders();
    console.log('=== ADMIN ORDERS DEBUG ===');
    console.log('Full API Response:', result);
    console.log('Response Success:', result.success);
    console.log('Response Data:', result.data);

    if (result.success) {
      // Normalize the data to handle both camelCase and PascalCase
      const normalizedOrders = normalizeOrdersData(result.data || []);
      console.log('Normalized Orders:', normalizedOrders);

      if (normalizedOrders.length > 0) {
        console.log('Number of Orders:', normalizedOrders.length);
        console.log('First Normalized Order:', normalizedOrders[0]);
        console.log('First Order Items:', normalizedOrders[0].items);
        console.log('First Order Payment:', normalizedOrders[0].paymentMethod);
        console.log('First Order Total:', normalizedOrders[0].totalAmount);
      } else {
        console.log('No orders after normalization');
      }
      setOrders(normalizedOrders);
    } else {
      console.error('Failed to fetch orders:', result.error);
      setOrders([]);
    }
    console.log('=== END DEBUG ===');
    setLoading(false);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    const result = await adminApi.updateOrderStatus(orderId, newStatus);
    if (result.success) {
      alert('Order status updated');
      fetchOrders();
    } else {
      alert('Failed to update status');
    }
  };

  // Data is now normalized, so direct property access works
  const filteredOrders = selectedStatus === 'all'
    ? orders
    : orders.filter(o => o.status?.toLowerCase() === selectedStatus.toLowerCase());

  const statusOptions = ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Delivered', 'Cancelled'];
  const statusColors = {
    Pending: 'bg-yellow-500/20 text-yellow-300',
    Confirmed: 'bg-blue-500/20 text-blue-300',
    Preparing: 'bg-purple-500/20 text-purple-300',
    Ready: 'bg-green-500/20 text-green-300',
    Delivered: 'bg-emerald-500/20 text-emerald-300',
    Cancelled: 'bg-red-500/20 text-red-300',
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brand"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen p-6 md:p-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black mb-2">
            Manage <span className="text-brand">Orders</span>
          </h1>
          <p className="text-white/60">{filteredOrders.length} orders found</p>
        </div>

        {/* Status Filter */}
        <div className="glass rounded-2xl p-6 mb-8">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                selectedStatus === 'all'
                  ? 'bg-brand text-white'
                  : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              All Orders
            </button>
            {statusOptions.map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                  selectedStatus === status
                    ? 'bg-brand text-white'
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              className="glass rounded-2xl p-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Order Info */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-1">Order #{order.id}</h3>
                      <p className="text-sm text-white/60">
                        {order.orderDate ? new Date(order.orderDate).toLocaleString() : 'N/A'}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[order.status] || 'bg-gray-500/20 text-gray-300'}`}>
                      {order.status}
                    </span>
                  </div>

                  {/* Customer Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-brand" />
                      <div>
                        <p className="text-xs text-white/60">Customer</p>
                        <p className="font-semibold">{order.customerName || 'N/A'}</p>
                        <p className="text-sm text-white/60">{order.customerEmail || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-brand" />
                      <div>
                        <p className="text-xs text-white/60">Phone</p>
                        <p className="font-semibold">{order.customerPhone || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 md:col-span-2">
                      <MapPin className="w-5 h-5 text-brand flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-xs text-white/60">Delivery Address</p>
                        <p className="font-semibold">{order.deliveryAddress || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CreditCard className="w-5 h-5 text-brand" />
                      <div>
                        <p className="text-xs text-white/60">Payment</p>
                        <p className="font-semibold capitalize">{order.paymentMethod || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-sm font-semibold mb-3">Order Items</p>
                    <div className="space-y-2">
                      {order.items && order.items.length > 0 ? (
                        order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-sm">
                            <span>{item.name} x{item.quantity}</span>
                            <span className="font-semibold">৳{Number(item.totalPrice).toFixed(2)}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-white/60 text-sm">No items found</p>
                      )}
                    </div>
                    <div className="border-t border-white/10 mt-3 pt-3 flex justify-between items-center">
                      <span className="font-bold">Total</span>
                      <span className="text-xl font-black text-brand">
                        ৳{Number(order.totalAmount).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-4 flex flex-col">
                  <div className="flex-1">
                    <label className="block text-sm font-bold mb-3 text-brand uppercase tracking-wider">
                      Update Status
                    </label>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-brand/20 border-2 border-brand text-white font-semibold focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all [&>option]:bg-dark [&>option]:text-white cursor-pointer hover:bg-brand/30"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="text-xs text-white/60 mt-2">
                    Click to update order status
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <div className="glass rounded-2xl p-12 text-center">
            <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-white/20" />
            <p className="text-white/60">No orders found</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AdminOrders;
