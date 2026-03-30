import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Calendar, ShoppingBag, Clock, CheckCircle, LogOut, Edit, X } from 'lucide-react';
import api from '../utils/api';

const UserProfile = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await api.getOrders();
    if (result.success) {
      setOrders(result.data || []);
    } else {
      setError('Failed to load orders');
    }
    setLoading(false);
  }, []);

  // Redirect if not authenticated
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }
    fetchOrders();
  }, [isAuthenticated, navigate, fetchOrders]);

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const handleCancelOrder = async (orderId, orderStatus) => {
    // Check if order can be cancelled
    const cancelableStatuses = ['Pending', 'Confirmed', 'Preparing'];
    if (!cancelableStatuses.includes(orderStatus)) {
      alert(`Cannot cancel an order with status: ${orderStatus}`);
      return;
    }

    // Confirm cancellation
    if (!window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      return;
    }

    // Call cancel API
    const result = await api.cancelOrder(orderId);
    if (result.success) {
      alert('Order cancelled successfully');
      fetchOrders(); // Refresh orders
    } else {
      alert('Failed to cancel order: ' + (result.error || 'Unknown error'));
    }
  };

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'confirmed':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'preparing':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
      case 'ready':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'delivered':
        return 'bg-green-500/10 text-green-400 border-green-500/30';
      default:
        return 'bg-white/10 text-white/70 border-white/30';
    }
  };

  const getStatusIcon = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case 'pending':
        return <Clock className="w-5 h-5" />;
      case 'confirmed':
        return <CheckCircle className="w-5 h-5" />;
      case 'preparing':
        return <ShoppingBag className="w-5 h-5" />;
      case 'ready':
        return <ShoppingBag className="w-5 h-5" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-12 min-h-[calc(100vh-200px)]"
    >
      {/* Header */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-6xl font-black mb-4">
          My <span className="text-brand">Profile</span>
        </h1>
        <p className="text-white/60 text-lg">
          Manage your account and view your orders
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* User Information Card */}
        <motion.div
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-1"
        >
          <div className="glass rounded-2xl p-8 sticky top-24">
            {/* Avatar */}
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand/40 to-brand/20 flex items-center justify-center border-2 border-brand/50">
                <span className="text-5xl font-black">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
            </div>

            {/* User Details */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-1">{user?.name}</h2>
              <p className="text-sm text-white/60 capitalize">
                {user?.role === 'admin' ? 'Administrator' : 'Customer'}
              </p>
            </div>

            {/* User Info Items */}
            <div className="space-y-4 mb-8">
              {/* Email */}
              <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                <Mail className="w-5 h-5 text-brand flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-white/60">Email</p>
                  <p className="text-sm font-medium truncate">{user?.email}</p>
                </div>
              </div>

              {/* Phone (if available) */}
              {user?.phone && (
                <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                  <Phone className="w-5 h-5 text-brand flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-white/60">Phone</p>
                    <p className="text-sm font-medium">{user?.phone}</p>
                  </div>
                </div>
              )}

              {/* Address (if available) */}
              {user?.address && (
                <div className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg">
                  <MapPin className="w-5 h-5 text-brand flex-shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-xs text-white/60">Address</p>
                    <p className="text-sm font-medium line-clamp-2">{user?.address}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </motion.div>

        {/* Orders Section */}
        <motion.div
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <div className="glass rounded-2xl p-8">
            <div className="flex items-center space-x-2 mb-6">
              <ShoppingBag className="w-6 h-6 text-brand" />
              <h3 className="text-2xl font-bold">Order History</h3>
              <span className="ml-auto px-3 py-1 bg-brand/20 text-brand rounded-full text-sm font-semibold">
                {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
              </span>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-32 bg-white/5 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-white/20" />
                <p className="text-white/60">{error}</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-white/20" />
                <p className="text-white/60 mb-4">No orders yet</p>
                <button
                  onClick={() => navigate('/menu')}
                  className="px-6 py-2 gradient-brand rounded-lg font-semibold"
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 * index }}
                    className="border border-white/10 rounded-xl p-6 hover:border-white/20 hover:bg-white/5 transition-all"
                  >
                    {/* Order Header */}
                    <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
                      <div>
                        <p className="text-sm text-white/60">Order ID</p>
                        <p className="text-lg font-bold">#{order.id}</p>
                      </div>
                      <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="font-semibold text-sm capitalize">
                          {order.status?.toLowerCase().replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>

                    {/* Order Details Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 pb-4 border-b border-white/10">
                      {/* Date */}
                      <div>
                        <p className="text-xs text-white/60 flex items-center space-x-1 mb-1">
                          <Calendar className="w-4 h-4" />
                          <span>Date</span>
                        </p>
                        <p className="text-sm font-medium">
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                      </div>

                      {/* Payment Method */}
                      <div>
                        <p className="text-xs text-white/60 mb-1">Payment</p>
                        <p className="text-sm font-medium capitalize">
                          {order.paymentMethod?.replace(/([A-Z])/g, ' $1').trim() || 'N/A'}
                        </p>
                      </div>

                      {/* Items Count */}
                      <div>
                        <p className="text-xs text-white/60 mb-1">Items</p>
                        <p className="text-sm font-medium">
                          {order.orderItems?.length || 0} {order.orderItems?.length === 1 ? 'Item' : 'Items'}
                        </p>
                      </div>

                      {/* Total Amount */}
                      <div>
                        <p className="text-xs text-white/60 mb-1">Total</p>
                        <p className="text-sm font-bold text-brand">৳{order.totalAmount?.toFixed(2)}</p>
                      </div>
                    </div>

                    {/* Order Items */}
                    {order.orderItems && order.orderItems.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs text-white/60 font-semibold">Items:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {order.orderItems.map((item, idx) => (
                            <div key={idx} className="flex items-start space-x-2 p-2 bg-white/5 rounded">
                              <span className="text-xs bg-brand/20 text-brand px-2 py-1 rounded font-bold">
                                {item.quantity}×
                              </span>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{item.foodItemName}</p>
                                <p className="text-xs text-white/60">৳{item.price?.toFixed(2)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Address (if available) */}
                    {order.address && (
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <p className="text-xs text-white/60 flex items-center space-x-1 mb-1">
                          <MapPin className="w-4 h-4" />
                          <span>Delivery Address</span>
                        </p>
                        <p className="text-sm text-white/80 line-clamp-2">{order.address}</p>
                      </div>
                    )}

                    {/* Track Button */}
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <button
                        onClick={() => navigate(`/track?orderId=${order.id}`)}
                        className="py-2 bg-brand/20 hover:bg-brand/30 text-brand rounded-lg font-semibold transition-all text-sm"
                      >
                        Track Order
                      </button>
                      {['Pending', 'Confirmed', 'Preparing'].includes(order.status) && (
                        <button
                          onClick={() => handleCancelOrder(order.id, order.status)}
                          className="py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg font-semibold transition-all text-sm flex items-center justify-center space-x-1"
                        >
                          <X className="w-4 h-4" />
                          <span>Cancel</span>
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default UserProfile;
