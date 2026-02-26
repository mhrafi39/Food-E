import { motion } from 'framer-motion';
import { useState } from 'react';
import { Search, Package, Clock, CheckCircle, Phone } from 'lucide-react';

const TrackOrder = () => {
  const [orderId, setOrderId] = useState('');
  const [orderStatus, setOrderStatus] = useState(null);

  // Mock order tracking (in a real app, this would be an API call)
  const trackOrder = (e) => {
    e.preventDefault();
    
    if (!orderId) {
      alert('Please enter an order ID');
      return;
    }

    // Simulate order found
    setOrderStatus({
      id: orderId,
      status: 'preparing',
      estimatedTime: '20-25 minutes',
      items: [
        { name: 'Signature Beef Burger', quantity: 2 },
        { name: 'Classic Fries', quantity: 2 },
      ],
    });
  };

  const statusSteps = [
    {
      id: 'confirmed',
      label: 'Order Confirmed',
      icon: <CheckCircle className="w-6 h-6" />,
      completed: true,
    },
    {
      id: 'preparing',
      label: 'Preparing',
      icon: <Package className="w-6 h-6" />,
      completed: orderStatus?.status === 'preparing' || orderStatus?.status === 'ready' || orderStatus?.status === 'delivered',
    },
    {
      id: 'ready',
      label: 'Ready for Pickup',
      icon: <Clock className="w-6 h-6" />,
      completed: orderStatus?.status === 'ready' || orderStatus?.status === 'delivered',
    },
    {
      id: 'delivered',
      label: 'Completed',
      icon: <CheckCircle className="w-6 h-6" />,
      completed: orderStatus?.status === 'delivered',
    },
  ];

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
              placeholder="Enter your order ID (e.g., FE12345)"
              className="flex-1 px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-brand focus:outline-none transition-colors"
            />
            <button
              type="submit"
              className="px-6 py-3 gradient-brand rounded-lg font-semibold flex items-center space-x-2 hover:scale-105 transition-transform"
            >
              <Search className="w-5 h-5" />
              <span>Track</span>
            </button>
          </div>
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
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  Order #{orderStatus.id}
                </h2>
                <p className="text-white/60">
                  Estimated time: {orderStatus.estimatedTime}
                </p>
              </div>
              <a
                href="tel:+8801XXXXXXXXX"
                className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg font-semibold transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>Call Us</span>
              </a>
            </div>

            {/* Progress Steps */}
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute top-6 left-6 right-6 h-1 bg-white/10">
                <div
                  className="h-full bg-brand transition-all duration-500"
                  style={{
                    width: `${
                      (statusSteps.filter((s) => s.completed).length /
                        statusSteps.length) *
                      100
                    }%`,
                  }}
                />
              </div>

              {/* Steps */}
              <div className="relative grid grid-cols-2 md:grid-cols-4 gap-4">
                {statusSteps.map((step, index) => (
                  <div key={step.id} className="text-center">
                    <div
                      className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center transition-all ${
                        step.completed
                          ? 'bg-brand text-white'
                          : 'bg-white/10 text-white/40'
                      }`}
                    >
                      {step.icon}
                    </div>
                    <p
                      className={`text-sm font-medium ${
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
                {orderStatus.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between p-3 rounded-lg bg-white/5"
                  >
                    <span>{item.name}</span>
                    <span className="text-white/60">x{item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="glass rounded-2xl p-6 text-center">
            <p className="text-white/60 mb-4">
              Need help with your order?
            </p>
            <a
              href="tel:+8801XXXXXXXXX"
              className="inline-flex items-center space-x-2 px-6 py-3 gradient-brand rounded-lg font-semibold hover:scale-105 transition-transform"
            >
              <Phone className="w-5 h-5" />
              <span>Contact Support</span>
            </a>
          </div>
        </motion.div>
      )}

      {/* Demo Info */}
      {!orderStatus && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="max-w-2xl mx-auto glass rounded-2xl p-8 text-center"
        >
          <Package className="w-16 h-16 mx-auto mb-4 text-white/20" />
          <h3 className="text-xl font-bold mb-2">No Order Tracking Yet</h3>
          <p className="text-white/60 mb-4">
            After placing an order, you'll receive an order ID via WhatsApp.
          </p>
          <p className="text-white/40 text-sm">
            Demo: Try entering any ID like "FE12345" to see the tracking interface
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default TrackOrder;
