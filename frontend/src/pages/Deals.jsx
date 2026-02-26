import { motion } from 'framer-motion';
import { Tag, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import api from '../utils/api';

const Deals = () => {
  const { addToCart } = useCart();
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch deals from backend
  useEffect(() => {
    const fetchDeals = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await api.getDeals();
        if (result.success) {
          // Transform backend data to match frontend structure
          const transformedDeals = result.data.map(item => ({
            id: item.id,
            name: item.name,
            description: item.description || '',
            originalPrice: item.discountPercentage 
              ? Math.round(item.price / (1 - item.discountPercentage / 100))
              : item.price,
            discountPrice: item.price,
            savings: item.discountPercentage 
              ? Math.round(item.price / (1 - item.discountPercentage / 100) - item.price)
              : 0,
            emoji: getDealEmoji(item.name),
            badge: item.discountPercentage > 20 ? 'Best Deal' : 'Special Offer',
            items: getItemsList(item.description)
          }));
          setDeals(transformedDeals);
        } else {
          setError(result.error || 'Failed to fetch deals');
        }
      } catch (err) {
        setError('Failed to load deals');
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  // Helper function to get emoji based on deal name
  const getDealEmoji = (name) => {
    if (name.includes('Mega')) return '🍔';
    if (name.includes('Family')) return '👨‍👩‍👧‍👦';
    if (name.includes('Solo')) return '🍟';
    if (name.includes('Double')) return '🔥';
    if (name.includes('Chicken')) return '🍗';
    if (name.includes('Weekend')) return '🎉';
    return '🎁';
  };

  // Helper function to get items list from description
  const getItemsList = (description) => {
    // Extract items from description (e.g., "2 Burgers + 2 Fries + 2 Drinks")
    if (description) {
      return description.split('+').map(item => item.trim());
    }
    return [];
  };

  const handleAddDeal = (deal) => {
    const dealItem = {
      id: deal.id.toString(),
      name: deal.name,
      description: deal.description,
      price: deal.discountPrice,
      emoji: deal.emoji,
      image: 'https://images.unsplash.com/photo-1513185158878-8d8c2a2a3da3?w=800&q=80'
    };
    addToCart(dealItem);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brand mx-auto mb-4"></div>
          <p className="text-white/60">Loading deals...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-3 gradient-brand rounded-lg font-semibold"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
          Exclusive <span className="text-brand">Deals</span>
        </h1>
        <p className="text-white/60 text-lg mb-4">
          Save big with our combo offers!
        </p>
        <div className="inline-flex items-center space-x-2 glass px-4 py-2 rounded-full">
          <Clock className="w-4 h-4 text-brand" />
          <span className="text-sm">Limited time offers</span>
        </div>
      </motion.div>

      {/* Deals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {deals.map((deal, index) => (
          <motion.div
            key={deal.id}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -8 }}
            className="glass rounded-2xl overflow-hidden shadow-xl hover:shadow-brand/20 transition-all"
          >
            {/* Badge */}
            {deal.badge && (
              <div className="bg-brand px-4 py-2 text-center font-bold text-sm">
                {deal.badge}
              </div>
            )}

            <div className="p-6">
              {/* Emoji */}
              <div className="text-6xl mb-4 text-center">{deal.emoji}</div>

              {/* Title */}
              <h3 className="text-2xl font-bold mb-2 text-center">
                {deal.name}
              </h3>
              <p className="text-white/60 text-sm mb-4 text-center">
                {deal.description}
              </p>

              {/* Items List */}
              <div className="mb-6 space-y-2">
                {deal.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center space-x-2 text-sm text-white/80"
                  >
                    <span className="text-brand">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Savings Badge */}
              <div className="flex items-center justify-center space-x-2 mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <Tag className="w-4 h-4 text-green-400" />
                <span className="font-bold text-green-400">
                  Save ৳{deal.savings}
                </span>
              </div>

              {/* Price */}
              <div className="mb-6 text-center">
                <div className="flex items-center justify-center space-x-3">
                  <span className="text-white/40 line-through text-lg">
                    ৳{deal.originalPrice}
                  </span>
                  <span className="text-3xl font-black text-brand">
                    ৳{deal.discountPrice}
                  </span>
                </div>
              </div>

              {/* Add Button */}
              <button
                onClick={() => handleAddDeal(deal)}
                className="w-full py-3 gradient-brand rounded-lg font-semibold hover:scale-105 transition-transform shadow-lg shadow-brand/30"
              >
                Add to Cart
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Deals;
