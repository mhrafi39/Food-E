/* eslint-disable react-hooks/exhaustive-deps */
import { motion, AnimatePresence } from 'framer-motion';
import { Save, ArrowLeft, ArrowRight, Plus, Trash2, Calculator } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import adminApi from '../utils/adminApi';

const ItemForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [step, setStep] = useState(1); // 1 = Basic Info, 2 = Recipe & Pricing

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Burger',
    imageUrl: '',
    isAvailable: true,
    isDeal: false,
    isDirectPurchase: false,
    directPurchaseCost: '',
  });

  const [recipe, setRecipe] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMaterials();
    if (isEdit) {
      fetchItem();
    }
  }, [isEdit, id]);

  useEffect(() => {
    calculatePrice();
  }, [recipe, materials]);

  const fetchMaterials = async () => {
    const result = await adminApi.getAllMaterials();
    if (result.success) {
      setMaterials(result.data);
    }
  };

  const fetchItem = async () => {
    const itemResult = await adminApi.getItemWithRecipe(id);
    if (itemResult.success) {
      const item = itemResult.data;
      setFormData({
        name: item.name,
        description: item.description || '',
        category: item.category,
        imageUrl: item.imageUrl || '',
        isAvailable: item.isAvailable,
        isDeal: item.isDeal,
        isDirectPurchase: item.isDirectPurchase || false,
        directPurchaseCost: item.directPurchaseCost?.toString() || '',
      });

      // Fetch recipe if exists
      const recipeResult = await adminApi.getRecipeByFoodItem(id);
      if (recipeResult.success && recipeResult.data) {
        const ingredients = recipeResult.data.ingredients.map(ing => ({
          rawMaterialId: ing.rawMaterialId,
          quantityNeeded: ing.quantityNeeded
        }));
        setRecipe(ingredients);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const calculatePrice = () => {
    if (formData.isDirectPurchase) {
      // For direct purchase items - apply 35% profit margin automatically
      const cost = parseFloat(formData.directPurchaseCost);
      if (isNaN(cost) || cost <= 0) {
        setTotalCost(0);
        setCalculatedPrice(0);
        return;
      }
      setTotalCost(cost);
      setCalculatedPrice(cost * 1.35); // 35% profit margin
    } else {
      // Calculate from recipe
      let cost = 0;
      recipe.forEach(ingredient => {
        const material = materials.find(m => m.id === ingredient.rawMaterialId);
        if (material && ingredient.quantityNeeded > 0) {
          const qty = parseFloat(ingredient.quantityNeeded);
          if (!isNaN(qty)) {
            cost += material.costPerUnit * qty;
          }
        }
      });
      setTotalCost(cost);
      // Add 35% profit margin
      setCalculatedPrice(cost * 1.35);
    }
  };

  const addIngredient = () => {
    setRecipe([...recipe, { rawMaterialId: materials[0]?.id || 0, quantityNeeded: 1 }]);
  };

  const removeIngredient = (index) => {
    setRecipe(recipe.filter((_, i) => i !== index));
  };

  const updateIngredient = (index, field, value) => {
    const updated = [...recipe];
    if (field === 'rawMaterialId') {
      updated[index] = { ...updated[index], [field]: parseInt(value) || materials[0]?.id || 0 };
    } else {
      // For quantityNeeded - handle empty string or invalid input
      if (value === '' || value === null || value === undefined) {
        updated[index] = { ...updated[index], [field]: '' };
      } else {
        const numValue = parseFloat(value);
        updated[index] = { ...updated[index], [field]: isNaN(numValue) ? 0.01 : Math.max(0.01, numValue) };
      }
    }
    setRecipe(updated);
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (step === 1) {
      // Validate basic info
      if (!formData.name || !formData.category) {
        setError('Please fill in all required fields');
        return;
      }
      setError('');
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate
    if (!formData.isDirectPurchase && recipe.length === 0) {
      setError('Please add at least one ingredient to the recipe');
      setLoading(false);
      return;
    }

    // Validate recipe ingredients have valid quantities
    if (!formData.isDirectPurchase) {
      const invalidIngredient = recipe.find(ing => {
        const qty = typeof ing.quantityNeeded === 'number' ? ing.quantityNeeded : parseFloat(ing.quantityNeeded);
        return isNaN(qty) || qty <= 0;
      });

      if (invalidIngredient) {
        setError('All ingredients must have a valid quantity greater than 0');
        setLoading(false);
        return;
      }
    }

    if (formData.isDirectPurchase && !formData.directPurchaseCost) {
      setError('Please set cost for direct purchase item');
      setLoading(false);
      return;
    }

    if (formData.isDirectPurchase && parseFloat(formData.directPurchaseCost) <= 0) {
      setError('Purchase cost must be greater than 0');
      setLoading(false);
      return;
    }

    // Build clean request payload
    const itemData = {
      FoodItem: {
        Id: isEdit ? parseInt(id) : 0,
        Name: formData.name.trim(),
        Description: formData.description.trim() || null,
        Category: formData.category,
        ImageUrl: formData.imageUrl.trim() || null,
        IsAvailable: formData.isAvailable,
        IsDeal: formData.isDeal,
        IsDirectPurchase: formData.isDirectPurchase,
        DirectPurchaseCost: formData.isDirectPurchase ? parseFloat(formData.directPurchaseCost) : null
      },
      RecipeIngredients: formData.isDirectPurchase ? [] : recipe.map(ing => ({
        RawMaterialId: parseInt(ing.rawMaterialId),
        QuantityNeeded: parseFloat(ing.quantityNeeded)
      }))
    };

    console.log('Submitting item data:', JSON.stringify(itemData, null, 2));

    let result;
    if (isEdit) {
      result = await adminApi.updateItem(id, itemData);
    } else {
      result = await adminApi.createItem(itemData);
    }

    setLoading(false);

    if (result.success) {
      navigate('/admin/items');
    } else {
      console.error('API Error:', result.error);
      setError(result.error || 'Failed to save item');
    }
  };

  const categories = ['Burger', 'Chicken Fry', 'French Fry', 'Noodles', 'Mojo'];

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link to="/admin/items" className="text-brand hover:underline flex items-center mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Items
          </Link>
          <h1 className="text-4xl font-black mb-2">
            {isEdit ? 'Edit' : 'Add New'} <span className="text-brand">Item</span>
          </h1>
          <p className="text-white/60">
            {step === 1 ? 'Step 1: Basic Information' : 'Step 2: Recipe & Pricing'}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center mb-8">
          <div className={`flex-1 h-2 rounded-full transition-all ${step >= 1 ? 'bg-brand' : 'bg-white/10'}`} />
          <div className="w-4" />
          <div className={`flex-1 h-2 rounded-full transition-all ${step >= 2 ? 'bg-brand' : 'bg-white/10'}`} />
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={step === 1 ? handleNext : handleSubmit}>
          <AnimatePresence mode="wait">
            {/* Step 1: Basic Information */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div className="glass rounded-2xl p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Item Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-brand"
                      placeholder="e.g., Beef Burger"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="4"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-brand"
                      placeholder="Describe your item..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="category"
                      required
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-brand"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Image URL</label>
                    <input
                      type="text"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-brand"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div className="flex items-center space-x-6">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="isAvailable"
                        checked={formData.isAvailable}
                        onChange={handleChange}
                        className="w-5 h-5 rounded border-white/10 bg-white/5 text-brand focus:ring-brand"
                      />
                      <span className="text-sm font-semibold">Available</span>
                    </label>

                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="isDeal"
                        checked={formData.isDeal}
                        onChange={handleChange}
                        className="w-5 h-5 rounded border-white/10 bg-white/5 text-brand focus:ring-brand"
                      />
                      <span className="text-sm font-semibold">Featured Deal</span>
                    </label>

                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="isDirectPurchase"
                        checked={formData.isDirectPurchase}
                        onChange={handleChange}
                        className="w-5 h-5 rounded border-white/10 bg-white/5 text-brand focus:ring-brand"
                      />
                      <span className="text-sm font-semibold">Direct Purchase (No Recipe)</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="gradient-brand px-8 py-3 rounded-lg font-semibold flex items-center space-x-2"
                  >
                    <span>Next: Add Recipe</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Recipe & Pricing */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="glass rounded-2xl p-6 space-y-6">
                  <h2 className="text-2xl font-bold flex items-center">
                    <Calculator className="w-6 h-6 mr-2 text-brand" />
                    {formData.isDirectPurchase ? 'Set Cost & Profit' : 'Build Recipe'}
                  </h2>

                  {formData.isDirectPurchase ? (
                    /* Direct Purchase Fields */
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2">
                          Purchase Cost (৳) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          name="directPurchaseCost"
                          required
                          value={formData.directPurchaseCost}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-brand"
                          placeholder="e.g., 20"
                        />
                        <p className="text-xs text-white/60 mt-1">Cost per unit of this item</p>
                      </div>

                      <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-white/80">Profit Margin (35% auto):</span>
                          <span className="text-lg font-bold text-green-400">
                            ৳{((parseFloat(formData.directPurchaseCost) || 0) * 0.35).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-white/80">Selling Price:</span>
                          <span className="text-xl font-bold text-brand">
                            ৳{calculatedPrice.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Recipe Builder */
                    <div className="space-y-4">
                      {recipe.map((ingredient, index) => {
                        const material = materials.find(m => m.id === ingredient.rawMaterialId);
                        const ingredientCost = material ? material.costPerUnit * ingredient.quantityNeeded : 0;

                        return (
                          <div key={index} className="flex items-center space-x-3 p-4 bg-white/5 rounded-lg">
                            <div className="flex-1">
                              <select
                                value={ingredient.rawMaterialId}
                                onChange={(e) => updateIngredient(index, 'rawMaterialId', e.target.value)}
                                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-brand"
                              >
                                {materials.map((mat) => (
                                  <option key={mat.id} value={mat.id}>
                                    {mat.name} (৳{mat.costPerUnit}/{mat.unit})
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="w-32">
                              <input
                                type="number"
                                step="0.01"
                                min="0.01"
                                value={ingredient.quantityNeeded || ''}
                                onChange={(e) => updateIngredient(index, 'quantityNeeded', e.target.value)}
                                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-brand"
                                placeholder="Qty"
                                required
                              />
                            </div>
                            <div className="w-24 text-right font-semibold text-brand">
                              ৳{(ingredientCost || 0).toFixed(2)}
                            </div>
                            <button
                              type="button"
                              onClick={() => removeIngredient(index)}
                              className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-all"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        );
                      })}

                      <button
                        type="button"
                        onClick={addIngredient}
                        disabled={materials.length === 0}
                        className="w-full px-4 py-3 border-2 border-dashed border-white/20 hover:border-brand/50 rounded-lg text-white/60 hover:text-brand transition-all flex items-center justify-center space-x-2"
                      >
                        <Plus className="w-5 h-5" />
                        <span>Add Ingredient</span>
                      </button>

                      {materials.length === 0 && (
                        <p className="text-yellow-500 text-sm">
                          ⚠️ No raw materials available. Please add materials first in the Raw Materials section.
                        </p>
                      )}
                    </div>
                  )}

                  {/* Price Calculation Summary */}
                  <div className="border-t border-white/10 pt-6 space-y-3">
                    <div className="flex justify-between text-lg">
                      <span className="text-white/60">Total Cost:</span>
                      <span className="font-bold">৳{totalCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg">
                      <span className="text-white/60">
                        {formData.isDirectPurchase ? 'Profit Margin:' : 'Profit (35%):'}
                      </span>
                      <span className="font-bold text-green-500">
                        ৳{(calculatedPrice - totalCost).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-2xl border-t border-white/10 pt-3">
                      <span className="font-bold">Selling Price:</span>
                      <span className="font-black text-brand">৳{calculatedPrice.toFixed(2)}</span>
                    </div>
                    {!formData.isDirectPurchase && (
                      <p className="text-xs text-white/40 text-right">
                        Profit margin: {totalCost > 0 ? (((calculatedPrice - totalCost) / totalCost) * 100).toFixed(1) : 0}%
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-8 py-3 bg-white/5 hover:bg-white/10 rounded-lg font-semibold flex items-center space-x-2 transition-all"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back</span>
                  </button>
                  <button
                    type="submit"
                    disabled={loading || (!formData.isDirectPurchase && recipe.length === 0)}
                    className="gradient-brand px-8 py-3 rounded-lg font-semibold flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        <span>{isEdit ? 'Update Item' : 'Create Item'}</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </div>
  );
};

export default ItemForm;
