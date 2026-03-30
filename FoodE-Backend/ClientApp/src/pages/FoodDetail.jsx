import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, ShoppingCart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import FoodCard from '../components/FoodCard';
import api from '../utils/api';
import { motion } from 'framer-motion';

const FoodDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [item, setItem] = useState(null);
  const [similarItems, setSimilarItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

   // Fetch item details from backend
   useEffect(() => {
    const fetchItemDetails = async () => {
      setLoading(true);
      setQuantity(1); // Reset quantity when fetching new item
      try {
        // Fetch the specific item
        const itemResult = await api.getFoodItem(id);
        if (itemResult.success) {
          setItem(itemResult.data);

          // Fetch all items to get similar ones from same category
          const allItemsResult = await api.getFoodItems();
          if (allItemsResult.success) {
            const similar = allItemsResult.data
              .filter(i => 
                i.category === itemResult.data.category && 
                i.id !== itemResult.data.id &&
                i.isAvailable
              )
              .slice(0, 3);
            setSimilarItems(similar);
          }
        } else {
          console.error('Failed to fetch item:', itemResult.error);
        }
      } catch (error) {
        console.error('Error fetching item:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetails();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="animate-pulse">
          <div className="h-8 bg-white/10 rounded w-1/4 mb-8"></div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="aspect-square bg-white/10 rounded-2xl"></div>
            <div>
              <div className="h-12 bg-white/10 rounded mb-4"></div>
              <div className="h-6 bg-white/10 rounded w-3/4 mb-4"></div>
              <div className="h-24 bg-white/10 rounded mb-6"></div>
              <div className="h-16 bg-white/10 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Item Not Found</h2>
        <p className="text-white/60 mb-6">The item you're looking for doesn't exist or has been removed.</p>
        <button
          onClick={() => navigate('/menu')}
          className="px-6 py-3 gradient-brand rounded-lg font-semibold"
        >
          Back to Menu
        </button>
      </div>
    );
  }

  const calculatePrice = () => {
    return item.price * quantity;
  };

  const handleAddToCart = () => {
    // Validate quantity against prepared stock
    if (quantity > item.preparedStock) {
      alert(`Cannot add ${quantity} items. Only ${item.preparedStock} available in stock.`);
      return;
    }

    for (let i = 0; i < quantity; i++) {
      addToCart(item);
    }
    alert(`Added ${quantity} ${item.name} to cart!`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen py-12"
    >
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center space-x-2 text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Left: Image */}
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="glass rounded-3xl overflow-hidden relative">
              <img
                src={item.imageUrl || 'https://via.placeholder.com/400'}
                alt={item.name}
                className="w-full aspect-square object-cover"
              />
              {item.isDeal && (
                <div className="absolute top-6 right-6">
                  <span className="px-4 py-2 gradient-brand text-white text-sm font-bold rounded-full shadow-lg">
                    Deal
                  </span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right: Details */}
          <motion.div
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col"
          >
            <h1 className="text-4xl md:text-5xl font-black mb-4">{item.name}</h1>
            <p className="text-white/80 mb-6">{item.description || 'Delicious food item'}</p>

            {/* Category */}
            <div className="mb-6">
              <span className="px-3 py-1 bg-brand/20 text-brand rounded-full text-sm font-semibold">
                {item.category}
              </span>
            </div>

            {/* Price */}
            <div className="mb-8">
              <div className="flex items-baseline space-x-3">
                <span className="text-5xl font-black text-brand">৳{item.price}</span>
                {item.originalPrice && item.originalPrice > item.price && (
                  <span className="text-2xl text-white/40 line-through">৳{item.originalPrice}</span>
                )}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <h3 className="font-bold mb-3">Quantity:</h3>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 rounded-lg glass hover:bg-white/10 transition-colors flex items-center justify-center"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="text-2xl font-bold w-12 text-center">{quantity}</span>
                <button
                  onClick={() => {
                    const maxQuantity = item.preparedStock || 0;
                    if (quantity < maxQuantity) {
                      setQuantity(quantity + 1);
                    }
                  }}
                  disabled={quantity >= (item.preparedStock || 0)}
                  className="w-12 h-12 rounded-lg glass hover:bg-white/10 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-white/60 mt-2">
                Available: {item.preparedStock || 0} {(item.preparedStock || 0) === 1 ? 'item' : 'items'}
              </p>
            </div>

            {/* Total & Add to Cart */}
            <div className="mt-auto">
              <div className="flex items-center justify-between mb-6">
                <span className="text-lg">Total:</span>
                <span className="text-3xl font-black text-brand">৳{calculatePrice()}</span>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!item.isAvailable || quantity > item.preparedStock}
                className="w-full py-4 gradient-brand rounded-xl font-bold text-lg shadow-lg shadow-brand/50 hover:shadow-brand/70 transition-all hover:scale-105 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <ShoppingCart className="w-6 h-6" />
                <span>{!item.isAvailable ? 'Currently Unavailable' : quantity > item.preparedStock ? 'Quantity Exceeds Available Stock' : 'Add to Cart'}</span>
              </button>

              {/* Availability Status */}
              <div className="mt-4 text-center">
                {!item.isAvailable ? (
                  <span className="text-red-400 text-sm">✗ Out of Stock</span>
                ) : quantity > item.preparedStock ? (
                  <span className="text-orange-400 text-sm">⚠ Requested quantity exceeds available stock</span>
                ) : (
                  <span className="text-green-400 text-sm">✓ Available Now</span>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Similar Items */}
        {similarItems.length > 0 && (
          <motion.section
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <h2 className="text-3xl md:text-4xl font-black mb-8">
              Similar <span className="text-brand">Items</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarItems.map((similarItem, index) => (
                <motion.div
                  key={similarItem.id}
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <FoodCard item={similarItem} />
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </motion.div>
  );
};

export default FoodDetail;
