import { motion } from 'framer-motion';
import { useState } from 'react';
import { Search, Package, Clock, CheckCircle, Phone, Truck, MapPin } from 'lucide-react';
import api from '../utils/api';

const TrackOrder = () => {
  const [orderId, setOrderId] = useState('');
  const [orderStatus, setOrderStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Track order using API
  const trackOrder = async (e) => {
    e.preventDefault();

    if (!orderId) {
      setError('Please enter an order ID');
      return;
    }

    setLoading(true);
    setError(null);

    const result = await api.getOrder(orderId);

    if (result.success) {
      setOrderStatus(result.data);
    } else {
      setError(result.error || 'Order not found. Please check your order ID.');
      setOrderStatus(null);
    }

    setLoading(false);
  };

  const getStatusSteps = (currentStatus) => {
    const status = currentStatus?.toLowerCase();
    const statusOrder = ['pending', 'confirmed', 'preparing', 'ready', 'delivered'];
    const currentIndex = statusOrder.indexOf(status);

    return [
      {
        id: 'pending',
        label: 'Order Placed',
        icon: <CheckCircle className="w-6 h-6" />,
        completed: currentIndex >= 0,
      },
      {
        id: 'confirmed',
        label: 'Order Confirmed',
        icon: <CheckCircle className="w-6 h-6" />,
        completed: currentIndex >= 1,
      },
      {
        id: 'preparing',
        label: 'Preparing',
        icon: <Package className="w-6 h-6" />,
        completed: currentIndex >= 2,
      },
      {
        id: 'ready',
        label: 'Out for Delivery',
        icon: <Truck className="w-6 h-6" />,
        completed: currentIndex >= 3,
      },
      {
        id: 'delivered',
        label: 'Delivered',
        icon: <CheckCircle className="w-6 h-6" />,
        completed: currentIndex >= 4,
      },
    ];
  };

  const statusSteps = orderStatus ? getStatusSteps(orderStatus.status) : [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-12"
    >
      {/* Header */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-6xl font-black mb-4">
          Track Your <span className="text-brand">Order</span>
        </h1>
        <p className="text-white/60 text-lg">
          Enter your order ID to track your delivery
        </p>
      </motion.div>

      {/* Search Form */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="max-w-2xl mx-auto mb-12"
      >
        <form onSubmit={trackOrder} className="glass rounded-2xl p-8">
          <label className="block text-sm font-medium mb-3">Order ID</label>
          <div className="flex space-x-3">
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Enter your order ID (e.g., 1, 2, 3)"
              className="flex-1 px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-brand focus:outline-none transition-colors"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 gradient-brand rounded-lg font-semibold flex items-center space-x-2 hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>Track</span>
                </>
              )}
            </button>
          </div>
          {error && (
            <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}
        </form>
      </motion.div>

      {/* Order Status */}
      {orderStatus && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <div className="glass rounded-2xl p-8 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  Order #{orderStatus.id}
                </h2>
                <p className="text-white/60">
                  Status: <span className="capitalize font-semibold text-brand">{orderStatus.status}</span>
                </p>
                <p className="text-white/60 text-sm">
                  Placed on: {new Date(orderStatus.orderDate).toLocaleString()}
                </p>
              </div>
              <div className="flex flex-col items-start md:items-end gap-2">
                <div className="text-sm text-white/60">
                  <strong className="text-white">Customer:</strong> {orderStatus.customerName}
                </div>
                <div className="text-sm text-white/60">
                  <strong className="text-white">Phone:</strong> {orderStatus.customerPhone}
                </div>
                <a
                  href={`tel:${orderStatus.customerPhone}`}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg font-semibold transition-colors text-sm"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Customer</span>
                </a>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="relative mb-8">
              {/* Progress Line */}
              <div className="absolute top-6 left-6 right-6 h-1 bg-white/10 hidden md:block">
                <div
                  className="h-full bg-brand transition-all duration-500"
                  style={{
                    width: `${
                      statusSteps.length > 0
                        ? ((statusSteps.filter((s) => s.completed).length - 1) /
                          (statusSteps.length - 1)) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </div>

              {/* Steps */}
              <div className="relative grid grid-cols-2 md:grid-cols-5 gap-4">
                {statusSteps.map((step, index) => (
                  <div key={step.id} className="text-center">
                    <div
                      className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center transition-all ${
                        step.completed
                          ? 'bg-brand text-white shadow-lg shadow-brand/50'
                          : 'bg-white/10 text-white/40'
                      }`}
                    >
                      {step.icon}
                    </div>
                    <p
                      className={`text-xs md:text-sm font-medium ${
                        step.completed ? 'text-white' : 'text-white/40'
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Items */}
            <div className="mt-8 pt-8 border-t border-white/10">
              <h3 className="font-bold mb-4">Order Items:</h3>
              <div className="space-y-2">
                {orderStatus.items && orderStatus.items.length > 0 ? (
                  orderStatus.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 rounded-lg bg-white/5"
                    >
                      <div className="flex-1">
                        <span className="font-semibold">{item.name}</span>
                        <span className="text-white/60 text-sm"> x{item.quantity}</span>
                      </div>
                      <span className="font-semibold text-brand">৳{item.totalPrice.toFixed(2)}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-white/60 text-sm">No items found</p>
                )}
              </div>
              <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                <span className="font-bold text-lg">Total Amount:</span>
                <span className="text-2xl font-black text-brand">৳{orderStatus.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Delivery Address */}
            {orderStatus.deliveryAddress && (
              <div className="mt-6 pt-6 border-t border-white/10">
                <h3 className="font-bold mb-2 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-brand" />
                  Delivery Address:
                </h3>
                <p className="text-white/80">{orderStatus.deliveryAddress}</p>
              </div>
            )}

            {/* Notes */}
            {orderStatus.notes && (
              <div className="mt-4 p-3 bg-white/5 rounded-lg">
                <p className="text-sm font-semibold text-white/60 mb-1">Customer Notes:</p>
                <p className="text-white/80">{orderStatus.notes}</p>
              </div>
            )}
          </div>

          {/* Help Section */}
          <div className="glass rounded-2xl p-6 text-center">
            <p className="text-white/60 mb-4">
              Need help with your order?
            </p>
            <a
              href={`tel:${orderStatus.customerPhone}`}
              className="inline-flex items-center space-x-2 px-6 py-3 gradient-brand rounded-lg font-semibold hover:scale-105 transition-transform"
            >
              <Phone className="w-5 h-5" />
              <span>Contact Customer</span>
            </a>
          </div>
        </motion.div>
      )}

      {/* Demo Info */}
      {!orderStatus && !loading && !error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="max-w-2xl mx-auto glass rounded-2xl p-8 text-center"
        >
          <Package className="w-16 h-16 mx-auto mb-4 text-white/20" />
          <h3 className="text-xl font-bold mb-2">Track Your Order</h3>
          <p className="text-white/60 mb-4">
            After placing an order, you'll receive an order ID. Enter it above to track your order status in real-time.
          </p>
          <p className="text-white/40 text-sm">
            Order ID is displayed after successful checkout and sent via WhatsApp.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default TrackOrder;
