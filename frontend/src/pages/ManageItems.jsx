import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Search, Package } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import adminApi from '../utils/adminApi';

const ManageItems = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    if (!user || user.role !== 'Admin') {
      navigate('/admin/login');
      return;
    }

    fetchItems();
  }, [user, navigate]);

  const fetchItems = async () => {
    setLoading(true);
    const result = await adminApi.getAllItems();
    if (result.success) {
      setItems(result.data);
      setFilteredItems(result.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    let filtered = items;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(
        (item) => item.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  }, [searchQuery, selectedCategory, items]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    const result = await adminApi.deleteItem(id);
    if (result.success) {
      alert('Item deleted successfully');
      fetchItems();
    } else {
      alert('Failed to delete item: ' + result.error);
    }
  };

  const categories = [
    { id: 'all', label: 'All Items' },
    ...Array.from(new Set(items.map((item) => item.category))).map((cat) => ({
      id: cat.toLowerCase(),
      label: cat,
    })),
  ];

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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-black mb-2">
              Manage <span className="text-brand">Items</span>
            </h1>
            <p className="text-white/60">{filteredItems.length} items found</p>
          </div>
          <Link
            to="/admin/items/new"
            className="mt-4 md:mt-0 inline-flex items-center px-6 py-3 gradient-brand rounded-lg font-semibold hover:scale-105 transition-transform"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Item
          </Link>
        </div>

        {/* Search & Filter */}
        <div className="glass rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-brand focus:outline-none transition-colors"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-brand text-white'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <Package className="w-16 h-16 mx-auto mb-4 text-white/20" />
            <p className="text-white/60">No items found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="glass rounded-2xl overflow-hidden"
              >
                {/* Image */}
                <div className="relative h-48 bg-white/5">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-16 h-16 text-white/20" />
                    </div>
                  )}
                  {item.isDeal && (
                    <div className="absolute top-2 right-2 px-3 py-1 bg-brand rounded-full text-xs font-bold">
                      {item.discountPercentage}% OFF
                    </div>
                  )}
                  {!item.isAvailable && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="px-4 py-2 bg-red-500 rounded-lg font-bold">
                        Unavailable
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="mb-2">
                    <span className="text-xs px-2 py-1 bg-brand/20 text-brand rounded-full">
                      {item.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                  <p className="text-white/60 text-sm mb-4 line-clamp-2">
                    {item.description || 'No description'}
                  </p>
                  <p className="text-2xl font-black text-brand mb-4">
                    ৳{item.price}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      to={`/admin/items/edit/${item.id}`}
                      className="flex-1 px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg font-semibold hover:bg-blue-500/30 transition-colors flex items-center justify-center"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id, item.name)}
                      className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg font-semibold hover:bg-red-500/30 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ManageItems;
