import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Phone, MapPin, MessageCircle, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../utils/api';

const Checkout = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { cartItems, getTotalPrice, clearCart } = useCart();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: '',
    notes: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('cod'); // cod, bkash, nagad, rocket, advance
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
    if (cartItems.length === 0) {
      navigate('/menu');
    }
  }, [isAuthenticated, cartItems, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getPaymentMethodName = () => {
    const methods = {
      cod: 'Cash on Delivery',
      bkash: 'bKash',
      nagad: 'Nagad',
      rocket: 'Rocket',
      advance: 'Advance Payment',
    };
    return methods[paymentMethod] || 'Cash on Delivery';
  };

  const generateWhatsAppMessage = () => {
    let message = `🍔 *New Order from ফুড-ই*\n\n`;
    message += `👤 *Customer Details:*\n`;
    message += `Name: ${formData.name}\n`;
    message += `Phone: ${formData.phone}\n`;
    message += `Address: ${formData.address}\n\n`;
    
    message += `📦 *Order Items:*\n`;
    cartItems.forEach((item, index) => {
      message += `${index + 1}. ${item.name} x${item.quantity} = ৳${item.price * item.quantity}\n`;
    });
    
    message += `\n💰 *Total: ৳${getTotalPrice()}*\n`;
    message += `💳 *Payment Method: ${getPaymentMethodName()}*\n`;
    
    if (paymentMethod === 'advance') {
      message += `\n⚠️ *Advance payment required before delivery*\n`;
      message += `Please send payment to:\n`;
      message += `bKash/Nagad/Rocket: 01XXX-XXXXXX\n`;
    }
    
    if (formData.notes) {
      message += `\n📝 *Special Notes:*\n${formData.notes}`;
    }
    
    return encodeURIComponent(message);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.address) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create order through backend API
      const orderData = {
        deliveryAddress: formData.address,
        phoneNumber: formData.phone,
        notes: formData.notes,
        paymentMethod: paymentMethod,
        items: cartItems.map(item => ({
          foodItemId: parseInt(item.id.replace(/[^0-9]/g, '')) || 1, // Extract numeric ID or default to 1
          quantity: item.quantity
        }))
      };

      const result = await api.createOrder(orderData);

      if (result.success) {
        // Generate WhatsApp message for notification
        const message = generateWhatsAppMessage();
        const whatsappNumber = '8801XXXXXXXXX'; // Update with actual number
        const whatsappURL = `https://wa.me/${whatsappNumber}?text=${message}`;

        // Open WhatsApp in new tab
        window.open(whatsappURL, '_blank');

        // Show success message
        alert(`Order placed successfully! Order ID: ${result.data.orderId}`);
        
        // Clear cart after order
        clearCart();
        
        // Redirect to track order page
        navigate('/track');
      } else {
        setError(result.error || 'Failed to place order');
        alert(result.error || 'Failed to place order. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while placing the order');
      alert('An error occurred while placing the order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || cartItems.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-20 pb-16"
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-4xl md:text-5xl font-black mb-8 text-center"
        >
          Complete Your <span className="gradient-text">Order</span>
        </motion.h1>

        <div className="grid md:grid-cols-[1.2fr,0.8fr] gap-8">
          {/* Column 1: Form */}
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="glass p-6 rounded-2xl">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <User className="mr-3 text-brand" />
                Delivery Information
              </h2>
              
              <form className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center">
                    <User className="w-4 h-4 mr-2 text-brand" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-brand focus:outline-none transition-colors"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-brand" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="01XXX-XXXXXX"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-brand focus:outline-none transition-colors"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-brand" />
                    Delivery Address *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="House/Flat, Road, Area, Landmark"
                    required
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-brand focus:outline-none transition-colors resize-none"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center">
                    <MessageCircle className="w-4 h-4 mr-2 text-brand" />
                    Special Instructions (Optional)
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Any special requests? (e.g., extra sauce, no onions)"
                    rows={2}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-brand focus:outline-none transition-colors resize-none"
                  />
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-lg font-bold mb-4">
                    Payment Method
                  </label>
                  
                  <div className="space-y-4">
                    {/* Cash on Delivery */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`w-full p-4 rounded-xl border-2 transition-all ${
                        paymentMethod === 'cod'
                          ? 'border-brand bg-brand/10 shadow-lg shadow-brand/20'
                          : 'border-white/10 hover:border-white/30 bg-white/5'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            paymentMethod === 'cod' ? 'border-brand' : 'border-white/30'
                          }`}>
                            {paymentMethod === 'cod' && (
                              <div className="w-3 h-3 rounded-full bg-brand"></div>
                            )}
                          </div>
                          <div className="text-left">
                            <div className="font-bold">Cash on Delivery</div>
                            <div className="text-xs text-white/60">Pay when you receive</div>
                          </div>
                        </div>
                        <span className="text-3xl">💵</span>
                      </div>
                    </button>

                    {/* Digital Payment - Foodpanda Style Row */}
                    <div>
                      <p className="text-sm text-white/60 mb-3">Digital Payment (Pay on delivery)</p>
                      <div className="grid grid-cols-3 gap-3">
                        {/* bKash */}
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('bkash')}
                          className={`p-4 rounded-xl border-2 transition-all hover:scale-105 ${
                            paymentMethod === 'bkash'
                              ? 'border-pink-500 bg-pink-500/10 shadow-lg shadow-pink-500/20'
                              : 'border-white/10 hover:border-white/30 bg-white/5'
                          }`}
                        >
                          <div className="flex flex-col items-center space-y-2">
                            <div className={`text-4xl ${paymentMethod === 'bkash' ? 'scale-110' : ''} transition-transform`}>
                              📱
                            </div>
                            <div className="text-sm font-bold">bKash</div>
                            {paymentMethod === 'bkash' && (
                              <div className="w-5 h-5 rounded-full bg-pink-500 flex items-center justify-center">
                                <span className="text-white text-xs">✓</span>
                              </div>
                            )}
                          </div>
                        </button>

                        {/* Nagad */}
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('nagad')}
                          className={`p-4 rounded-xl border-2 transition-all hover:scale-105 ${
                            paymentMethod === 'nagad'
                              ? 'border-orange-500 bg-orange-500/10 shadow-lg shadow-orange-500/20'
                              : 'border-white/10 hover:border-white/30 bg-white/5'
                          }`}
                        >
                          <div className="flex flex-col items-center space-y-2">
                            <div className={`text-4xl ${paymentMethod === 'nagad' ? 'scale-110' : ''} transition-transform`}>
                              📲
                            </div>
                            <div className="text-sm font-bold">Nagad</div>
                            {paymentMethod === 'nagad' && (
                              <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center">
                                <span className="text-white text-xs">✓</span>
                              </div>
                            )}
                          </div>
                        </button>

                        {/* Rocket */}
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('rocket')}
                          className={`p-4 rounded-xl border-2 transition-all hover:scale-105 ${
                            paymentMethod === 'rocket'
                              ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20'
                              : 'border-white/10 hover:border-white/30 bg-white/5'
                          }`}
                        >
                          <div className="flex flex-col items-center space-y-2">
                            <div className={`text-4xl ${paymentMethod === 'rocket' ? 'scale-110' : ''} transition-transform`}>
                              🚀
                            </div>
                            <div className="text-sm font-bold">Rocket</div>
                            {paymentMethod === 'rocket' && (
                              <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center">
                                <span className="text-white text-xs">✓</span>
                              </div>
                            )}
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Advance Payment */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('advance')}
                      className={`w-full p-4 rounded-xl border-2 transition-all ${
                        paymentMethod === 'advance'
                          ? 'border-green-500 bg-green-500/10 shadow-lg shadow-green-500/20'
                          : 'border-white/10 hover:border-white/30 bg-white/5'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            paymentMethod === 'advance' ? 'border-green-500' : 'border-white/30'
                          }`}>
                            {paymentMethod === 'advance' && (
                              <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            )}
                          </div>
                          <div className="text-left">
                            <div className="font-bold">Advance Payment</div>
                            <div className="text-xs text-white/60">Pay now via bKash/Nagad/Rocket</div>
                          </div>
                        </div>
                        <span className="text-3xl">💰</span>
                      </div>
                    </button>

                    {/* Payment Instructions */}
                    {paymentMethod === 'advance' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="p-4 rounded-xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30"
                      >
                        <p className="text-sm font-bold text-yellow-300 mb-2 flex items-center">
                          <span className="mr-2">⚠️</span>
                          Payment Instructions
                        </p>
                        <div className="space-y-2 text-sm text-white/80">
                          <p>Send payment to: <span className="font-bold text-brand">01XXX-XXXXXX</span></p>
                          <p className="text-xs text-white/60">Then share the transaction ID via WhatsApp</p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </motion.div>

          {/* Column 2: Order Summary - Foodpanda Style */}
          <motion.div
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="glass rounded-2xl sticky top-24 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-brand/20 to-orange-600/20 p-4 border-b border-white/10">
                <h2 className="text-xl font-bold flex items-center">
                  <ShoppingBag className="mr-2 text-brand" size={24} />
                  Your Order
                </h2>
                <p className="text-xs text-white/60 mt-1">{cartItems.length} item{cartItems.length > 1 ? 's' : ''}</p>
              </div>

              {/* Cart Items */}
              <div className="p-4 max-h-72 overflow-y-auto">
                <div className="space-y-3">
                  {cartItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start justify-between py-3 border-b border-white/5 last:border-0"
                    >
                      <div className="flex-1 pr-3">
                        <div className="flex items-center space-x-2">
                          <span className="flex items-center justify-center w-6 h-6 rounded bg-brand/20 text-brand text-xs font-bold">
                            {item.quantity}×
                          </span>
                          <h3 className="font-semibold text-sm">{item.name}</h3>
                        </div>
                        {item.size && (
                          <p className="text-xs text-white/50 mt-1 ml-8">Size: {item.size}</p>
                        )}
                        {item.extras && item.extras.length > 0 && (
                          <p className="text-xs text-white/50 mt-1 ml-8">
                            Extras: {item.extras.join(', ')}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-brand">৳{item.price * item.quantity}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="p-4 bg-white/5 border-t border-white/10 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Subtotal</span>
                  <span className="font-semibold">৳{getTotalPrice()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Delivery Fee</span>
                  <span className="font-semibold text-green-400">FREE</span>
                </div>
                <div className="flex justify-between text-xs pt-2 border-t border-white/10">
                  <span className="text-white/60">Payment</span>
                  <span className="font-bold text-brand text-sm">{getPaymentMethodName()}</span>
                </div>
                
                {/* Total */}
                <div className="flex justify-between items-center pt-3 border-t-2 border-brand/30">
                  <span className="text-lg font-bold">Total</span>
                  <div className="text-right">
                    <p className="text-2xl font-black text-brand">৳{getTotalPrice()}</p>
                    <p className="text-xs text-white/50">incl. all taxes</p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="p-4">
                <button
                  onClick={handleSubmit}
                  className="w-full py-4 gradient-brand rounded-xl font-bold text-lg shadow-xl shadow-brand/30 hover:shadow-brand/50 transition-all hover:scale-[1.02] flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Confirm Order</span>
                </button>

                <div className="mt-3 text-center">
                  {paymentMethod === 'advance' ? (
                    <p className="text-xs text-yellow-300 flex items-center justify-center">
                      <span className="mr-1">⚠️</span>
                      Send payment after WhatsApp confirmation
                    </p>
                  ) : paymentMethod === 'cod' ? (
                    <p className="text-xs text-green-400 flex items-center justify-center">
                      <span className="mr-1">✓</span>
                      Pay with cash when delivered
                    </p>
                  ) : (
                    <p className="text-xs text-white/60 flex items-center justify-center">
                      Pay via {getPaymentMethodName()} on delivery
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Checkout;
