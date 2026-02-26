import { motion } from 'framer-motion';
import { Save, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import adminApi from '../utils/adminApi';
import api from '../utils/api';

const ItemForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Burgers',
    imageUrl: '',
    isAvailable: true,
    isDeal: false,
    discountPercentage: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'Admin') {
      navigate('/admin/login');
      return;
    }

    if (isEdit) {
      fetchItem();
    }
  }, [user, navigate, isEdit, id]);

  const fetchItem = async () => {
    const result = await api.getFoodItem(id);
    if (result.success) {
      setFormData({
        name: result.data.name,
        description: result.data.description || '',
        price: result.data.price.toString(),
        category: result.data.category,
        imageUrl: result.data.imageUrl || '',
        isAvailable: result.data.isAvailable,
        isDeal: result.data.isDeal,
        discountPercentage: result.data.discountPercentage?.toString() || '',
      });
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.price) {
      setError('Name and price are required');
      return;
    }

    setLoading(true);

    const itemData = {
      id: isEdit ? parseInt(id) : 0,
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      imageUrl: formData.imageUrl,
      isAvailable: formData.isAvailable,
      isDeal: formData.isDeal,
      discountPercentage: formData.isDeal && formData.discountPercentage
        ? parseFloat(formData.discountPercentage)
        : null,
    };

    const result = isEdit
      ? await adminApi.updateItem(id, itemData)
      : await adminApi.createItem(itemData);

    setLoading(false);

    if (result.success) {
      alert(`Item ${isEdit ? 'updated' : 'created'} successfully!`);
      navigate('/admin/items');
    } else {
      setError(result.error || `Failed to ${isEdit ? 'update' : 'create'} item`);
    }
  };

  const categories = ['Burgers', 'Fries', 'Drinks', 'Deals'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen p-6 md:p-8"
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/admin/items"
            className="inline-flex items-center text-brand hover:text-brand/80 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Items
          </Link>
          <h1 className="text-4xl font-black">
            {isEdit ? 'Edit' : 'Add New'} <span className="text-brand">Item</span>
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="glass rounded-2xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-300">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Item Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Signature Beef Burger"
                required
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-brand focus:outline-none transition-colors"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Item description..."
                rows={3}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-brand focus:outline-none transition-colors resize-none"
              />
            </div>

            {/* Price & Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Price (৳) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="350"
                  step="0.01"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-brand focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-brand focus:outline-none transition-colors"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Image URL
              </label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-brand focus:outline-none transition-colors"
              />
              {formData.imageUrl && (
                <div className="mt-3">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Deal Settings */}
            <div className="space-y-4 p-4 bg-white/5 rounded-lg">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isDeal"
                  id="isDeal"
                  checked={formData.isDeal}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-white/10 text-brand focus:ring-brand"
                />
                <label htmlFor="isDeal" className="ml-3 font-medium">
                  This is a deal/combo
                </label>
              </div>

              {formData.isDeal && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Discount Percentage
                  </label>
                  <input
                    type="number"
                    name="discountPercentage"
                    value={formData.discountPercentage}
                    onChange={handleChange}
                    placeholder="15"
                    step="0.01"
                    min="0"
                    max="100"
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-brand focus:outline-none transition-colors"
                  />
                </div>
              )}
            </div>

            {/* Availability */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isAvailable"
                id="isAvailable"
                checked={formData.isAvailable}
                onChange={handleChange}
                className="w-4 h-4 rounded border-white/10 text-brand focus:ring-brand"
              />
              <label htmlFor="isAvailable" className="ml-3 font-medium">
                Item is available
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 gradient-brand rounded-lg font-bold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <Save className="w-5 h-5 mr-2" />
                {loading ? 'Saving...' : isEdit ? 'Update Item' : 'Create Item'}
              </button>
              <Link
                to="/admin/items"
                className="px-6 py-3 bg-white/5 rounded-lg font-bold hover:bg-white/10 transition-colors"
              >
                Cancel
              </Link>
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default ItemForm;
