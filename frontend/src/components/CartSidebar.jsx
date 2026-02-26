import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CartSidebar = () => {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    getTotalPrice,
  } = useCart();
  const { isAuthenticated } = useAuth();

  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      setIsCartOpen(false);
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
      return;
    }
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed top-0 right-0 h-full w-full sm:w-96 bg-matte border-l border-white/20 z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center">
                  <ShoppingBag className="w-6 h-6 mr-2 text-brand" />
                  Your Cart
                </h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-white/40">
                  <ShoppingBag className="w-20 h-20 mb-4" />
                  <p className="text-lg font-medium">Your cart is empty</p>
                  <p className="text-sm">Add some delicious items!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="glass rounded-xl p-4"
                    >
                      <div className="flex items-start space-x-4">
                        {/* Item Image/Emoji */}
                        <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-brand/20 to-brand/5 flex items-center justify-center flex-shrink-0">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <span className="text-3xl">{item.emoji || '🍔'}</span>
                          )}
                        </div>

                        {/* Item Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-sm mb-1 truncate">
                            {item.name}
                          </h3>
                          <p className="text-brand font-bold text-lg">
                            ৳{item.price * item.quantity}
                          </p>

                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-3 mt-2">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="font-bold w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 rounded-lg hover:bg-red-500/20 text-red-500 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-black/40">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-medium">Total</span>
                  <span className="text-3xl font-black text-brand">
                    ৳{getTotalPrice()}
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full py-4 gradient-brand rounded-lg font-bold text-lg shadow-lg shadow-brand/50 hover:shadow-brand/70 transition-all hover:scale-105"
                >
                  {isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}
                </button>
                {!isAuthenticated && (
                  <p className="text-center text-white/40 text-xs mt-2">
                    Please login to place your order
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;
