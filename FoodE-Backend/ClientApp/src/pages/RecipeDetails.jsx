/* eslint-disable react-hooks/set-state-in-effect, no-unused-vars, react-hooks/exhaustive-deps */
import { motion } from 'framer-motion';
import { ChefHat, ArrowLeft, Package, AlertTriangle, CheckCircle, ShoppingCart } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import adminApi from '../utils/adminApi';

const RecipeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipeData, setRecipeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantityToPrepare, setQuantityToPrepare] = useState(1);

  const fetchRecipeDetails = useCallback(async () => {
    setLoading(true);
    const result = await adminApi.getItemRecipeDetails(id);
    if (result.success) {
      const data = result.data;
      // Calculate profit margin percentage on frontend
      const profitMarginPercentage = data.totalRecipeCost > 0 
        ? ((data.profitPerItem / data.totalRecipeCost) * 100) 
        : 35; // Default 35% if cost is 0
      setRecipeData({
        ...data,
        profitMarginPercentage
      });
    } else {
      alert('Failed to load recipe details: ' + result.error);
      navigate('/admin/items');
    }
    setLoading(false);
  }, [id, navigate]);

  useEffect(() => {
    fetchRecipeDetails();
  }, [fetchRecipeDetails]);

  const handlePrepareItems = async () => {
    if (!recipeData) return;

    const maxQuantity = recipeData.maxQuantityCanMake;
    if (quantityToPrepare > maxQuantity) {
      alert(`Cannot prepare ${quantityToPrepare} items. Maximum available: ${maxQuantity}`);
      return;
    }

    // Show confirmation with ingredient deduction details
    const ingredientList = recipeData.ingredients
      .map(ing => `${ing.materialName}: ${(ing.quantityNeeded * quantityToPrepare).toFixed(2)} ${ing.unit}`)
      .join('\n');

    const confirmed = window.confirm(
      `Prepare ${quantityToPrepare} x ${recipeData.foodItemName}?\n\n` +
      `Materials to be used:\n${ingredientList}\n\n` +
      `This will deduct the materials from stock.`
    );

    if (confirmed) {
      setLoading(true);
      const result = await adminApi.prepareItems(id, quantityToPrepare);
      setLoading(false);

      if (result.success) {
        const newTotal = result.data.totalPreparedStock || 0;
        alert(`✅ Successfully prepared ${quantityToPrepare} x ${recipeData.foodItemName}\n\nTotal prepared stock: ${newTotal} items ready to sell`);
        fetchRecipeDetails(); // Refresh data to show updated stock
      } else {
        alert(`❌ Error: ${result.error}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brand"></div>
      </div>
    );
  }

  if (!recipeData) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          <div className="glass rounded-2xl p-12 text-center">
            <Package className="w-16 h-16 mx-auto mb-4 text-white/20" />
            <p className="text-white/60 mb-4">Recipe not found</p>
            <Link to="/admin/items" className="text-brand hover:underline">
              Back to Items
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const canPrepare = recipeData.maxQuantityCanMake > 0;
  const hasLowStock = recipeData.ingredients && recipeData.ingredients.some(ing => ing.isLowStock);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen p-6 md:p-8"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/admin/items"
            className="inline-flex items-center text-brand hover:underline mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Items
          </Link>
          <h1 className="text-4xl font-black mb-2">
            Recipe <span className="text-brand">Details</span>
          </h1>
          <p className="text-white/60">View ingredients and prepare items</p>
        </div>

        {/* Item Info Card */}
        <div className="glass rounded-2xl p-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">{recipeData.foodItemName}</h2>
              <div className="flex gap-4 text-sm flex-wrap">
                <div>
                  <span className="text-white/60">Selling Price:</span>
                  <span className="ml-2 text-brand font-bold text-lg">৳{(recipeData.foodItemPrice || 0).toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-white/60">Prepared Stock:</span>
                  <span className="ml-2 text-green-400 font-bold text-lg">{recipeData.preparedStock || 0} ready</span>
                </div>
                {recipeData.isDirectPurchase ? (
                  <div className="text-purple-300">
                    <Package className="w-4 h-4 inline mr-1" />
                    Direct Purchase Item
                  </div>
                ) : (
                  <div className="text-green-300">
                    <ChefHat className="w-4 h-4 inline mr-1" />
                    Recipe-Based Item
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Direct Purchase Info */}
        {recipeData.isDirectPurchase && (
          <div className="glass rounded-2xl p-6 mb-6">
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <ShoppingCart className="w-5 h-5 mr-2 text-purple-400" />
              Direct Purchase Information
            </h3>
            <div className="text-white/60">{recipeData.message}</div>
          </div>
        )}

        {/* Recipe Ingredients */}
        {!recipeData.isDirectPurchase && recipeData.ingredients && recipeData.ingredients.length > 0 && (
          <>
            {/* Cost Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="glass rounded-xl p-4">
                <p className="text-white/60 text-sm mb-1">Recipe Cost</p>
                <p className="text-2xl font-bold">৳{(recipeData.totalRecipeCost || 0).toFixed(2)}</p>
              </div>
              <div className="glass rounded-xl p-4">
                <p className="text-white/60 text-sm mb-1">Profit Per Item</p>
                <p className="text-2xl font-bold text-green-400">৳{(recipeData.profitPerItem || 0).toFixed(2)}</p>
              </div>
              <div className="glass rounded-xl p-4">
                <p className="text-white/60 text-sm mb-1">Profit Margin</p>
                <p className="text-2xl font-bold text-brand">{(recipeData.profitMarginPercentage || 0).toFixed(1)}%</p>
              </div>
            </div>

            {/* Ingredients List */}
            <div className="glass rounded-2xl p-6 mb-6">
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <ChefHat className="w-5 h-5 mr-2 text-brand" />
                Ingredients Required (per item)
              </h3>
              
              <div className="space-y-3">
                {recipeData.ingredients.map((ingredient, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      ingredient.isLowStock 
                        ? 'bg-red-500/10 border-red-500/30' 
                        : 'bg-white/5 border-white/10'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <p className="font-semibold">{ingredient.materialName}</p>
                        <p className="text-sm text-white/60">
                          Cost: ৳{(ingredient.costPerUnit || 0).toFixed(2)} per {ingredient.unit}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-brand">
                          {ingredient.quantityNeeded || 0} {ingredient.unit}
                        </p>
                        <p className="text-sm text-white/60">
                          ৳{(ingredient.totalCost || 0).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        {ingredient.isLowStock ? (
                          <>
                            <AlertTriangle className="w-4 h-4 text-red-400" />
                            <span className="text-red-400">Low Stock</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span className="text-green-400">In Stock</span>
                          </>
                        )}
                      </div>
                      <div className="text-white/70">
                        Available: {ingredient.currentStock || 0} {ingredient.unit} 
                        <span className="text-white/50 ml-2">
                          (makes ~{Math.floor(ingredient.quantityNeeded > 0 ? (ingredient.currentStock / ingredient.quantityNeeded) : 0)} items)
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Cost */}
              <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                <span className="font-semibold">Total Cost per Item:</span>
                <span className="text-xl font-bold text-brand">৳{(recipeData.totalRecipeCost || 0).toFixed(2)}</span>
              </div>
            </div>

            {/* Preparation Section */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <Package className="w-5 h-5 mr-2 text-brand" />
                Prepare Items
              </h3>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-white/80">Quantity to Prepare:</label>
                  <div className="text-sm">
                    <span className="text-white/60">Max available: </span>
                    <span className={`font-bold ${canPrepare ? 'text-green-400' : 'text-red-400'}`}>
                      {recipeData.maxQuantityCanMake} items
                    </span>
                  </div>
                </div>
                <input
                  type="number"
                  min="1"
                  max={recipeData.maxQuantityCanMake}
                  value={quantityToPrepare}
                  onChange={(e) => setQuantityToPrepare(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-brand focus:outline-none transition-colors text-lg font-bold"
                  disabled={!canPrepare}
                />
              </div>

              {/* Materials Needed for Selected Quantity */}
              <div className="mb-4 p-4 bg-white/5 rounded-lg">
                <p className="text-sm font-semibold mb-3 text-white/80">
                  Materials needed for {quantityToPrepare} item{quantityToPrepare > 1 ? 's' : ''}:
                </p>
                <div className="space-y-2">
                  {recipeData.ingredients.map((ing, idx) => {
                    const neededQty = ing.quantityNeeded * quantityToPrepare;
                    const hasEnough = neededQty <= ing.currentStock;
                    return (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className={hasEnough ? 'text-white/70' : 'text-red-400'}>
                          {ing.materialName}:
                        </span>
                        <span className={`font-semibold ${hasEnough ? 'text-white' : 'text-red-400'}`}>
                          {neededQty.toFixed(2)} {ing.unit}
                          {!hasEnough && ' (Insufficient!)'}
                        </span>
                      </div>
                    );
                  })}
                  <div className="pt-2 border-t border-white/10 flex justify-between font-bold">
                    <span>Total Cost:</span>
                    <span className="text-brand">৳{((recipeData.totalRecipeCost || 0) * quantityToPrepare).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Expected Profit:</span>
                    <span className="text-green-400">৳{((recipeData.profitPerItem || 0) * quantityToPrepare).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Warnings */}
              {hasLowStock && (
                <div className="mb-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-yellow-400 mb-1">Low Stock Warning</p>
                    <p className="text-sm text-white/70">
                      Some ingredients are running low. Consider restocking soon.
                    </p>
                  </div>
                </div>
              )}

              {!canPrepare && (
                <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-400 mb-1">Cannot Prepare</p>
                    <p className="text-sm text-white/70">
                      Insufficient materials in stock. Please restock ingredients before preparing this item.
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handlePrepareItems}
                  disabled={!canPrepare || quantityToPrepare > recipeData.maxQuantityCanMake}
                  className={`flex-1 px-6 py-3 rounded-lg font-bold transition-all flex items-center justify-center ${
                    canPrepare && quantityToPrepare <= recipeData.maxQuantityCanMake
                      ? 'gradient-brand hover:scale-105'
                      : 'bg-white/10 text-white/40 cursor-not-allowed'
                  }`}
                >
                  <Package className="w-5 h-5 mr-2" />
                  Prepare {quantityToPrepare} Item{quantityToPrepare > 1 ? 's' : ''}
                </button>
                <Link
                  to="/admin/materials"
                  className="px-6 py-3 bg-white/10 rounded-lg font-semibold hover:bg-white/20 transition-colors flex items-center"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Manage Materials
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default RecipeDetails;
