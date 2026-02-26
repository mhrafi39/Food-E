import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import FoodCard from '../components/FoodCard';
import api from '../utils/api';

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get unique categories from menu items
  const categories = [
    { id: 'all', label: 'All Items' },
    ...Array.from(new Set(menuItems.map(item => item.category)))
      .map(cat => ({
        id: cat.toLowerCase(),
        label: cat
      }))
  ];

  // Fetch menu items from backend
  useEffect(() => {
    const fetchMenuItems = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await api.getFoodItems();
        if (result.success) {
          // Transform backend data to match frontend structure
          const transformedItems = result.data.map(item => ({
            id: item.id,
            name: item.name,
            description: item.description || '',
            price: item.price,
            category: item.category.toLowerCase(),
            image: item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80',
            badge: item.isDeal ? `${item.discountPercentage}% OFF` : null,
            originalPrice: item.isDeal ? item.price / (1 - item.discountPercentage / 100) : null,
            isAvailable: item.isAvailable
          }));
          setMenuItems(transformedItems);
        } else {
          setError(result.error || 'Failed to fetch menu items');
        }
      } catch (err) {
        setError('Failed to load menu items');
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  const filteredItems = menuItems
    .filter((item) => activeCategory === 'all' || item.category === activeCategory)
    .filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
          Our <span className="text-brand">Menu</span>
        </h1>
        <p className="text-white/60 text-lg">
          Discover our delicious selection of premium food
        </p>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="max-w-2xl mx-auto mb-12"
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            type="text"
            placeholder="Search for your favorite food..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 glass rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>
      </motion.div>

      {/* Category Tabs */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex flex-wrap justify-center gap-4 mb-12"
      >
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeCategory === category.id
                ? 'gradient-brand text-white shadow-lg shadow-brand/50'
                : 'glass hover:bg-white/20'
            }`}
          >
            {category.label}
          </button>
        ))}
      </motion.div>

      {/* Menu Grid */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-brand/30 border-t-brand rounded-full animate-spin mb-4" />
            <p className="text-white/60 text-lg">Loading delicious items...</p>
          </div>
        ) : error ? (
          <div className="col-span-full text-center py-20">
            <p className="text-red-400 text-lg mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 gradient-brand rounded-lg font-semibold"
            >
              Retry
            </button>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="col-span-full text-center py-20">
            <p className="text-white/40 text-lg">No items found matching your search.</p>
          </div>
        ) : (
          filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
            >
              <FoodCard item={item} />
            </motion.div>
          ))
        )}
      </motion.div>
    </motion.div>
  );
};

export default Menu;
