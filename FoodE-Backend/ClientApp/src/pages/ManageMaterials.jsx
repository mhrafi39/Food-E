import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Package, AlertTriangle, ShoppingCart } from 'lucide-react';
import adminApi from '../utils/adminApi';

const ManageMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [purchasingMaterial, setPurchasingMaterial] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    unit: '',
    costPerUnit: '',
    currentStock: '',
    minimumStock: '',
  });

  const [purchaseData, setPurchaseData] = useState({
    quantity: '',
    costPerUnit: '',
    supplier: '',
    notes: '',
  });

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    setLoading(true);
    const result = await adminApi.getAllMaterials();
    if (result.success) {
      setMaterials(result.data);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const materialData = {
      ...formData,
      costPerUnit: parseFloat(formData.costPerUnit),
      currentStock: parseFloat(formData.currentStock),
      minimumStock: parseFloat(formData.minimumStock),
    };

    let result;
    if (editingMaterial) {
      result = await adminApi.updateMaterial(editingMaterial.id, {
        ...materialData,
        id: editingMaterial.id,
      });
    } else {
      result = await adminApi.createMaterial(materialData);
    }

    if (result.success) {
      fetchMaterials();
      closeModal();
    } else {
      alert('Error: ' + result.error);
    }
  };

  const handlePurchaseSubmit = async (e) => {
    e.preventDefault();
    
    const purchase = {
      rawMaterialId: purchasingMaterial.id,
      quantity: parseFloat(purchaseData.quantity),
      costPerUnit: parseFloat(purchaseData.costPerUnit),
      supplier: purchaseData.supplier,
      notes: purchaseData.notes,
    };

    const result = await adminApi.recordPurchase(purchase);

    if (result.success) {
      fetchMaterials();
      closePurchaseModal();
      alert('Purchase recorded successfully!');
    } else {
      alert('Error: ' + result.error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this material?')) {
      const result = await adminApi.deleteMaterial(id);
      if (result.success) {
        fetchMaterials();
      }
    }
  };

  const openEditModal = (material) => {
    setEditingMaterial(material);
    setFormData({
      name: material.name,
      unit: material.unit,
      costPerUnit: material.costPerUnit.toString(),
      currentStock: material.currentStock.toString(),
      minimumStock: material.minimumStock.toString(),
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingMaterial(null);
    setFormData({
      name: '',
      unit: '',
      costPerUnit: '',
      currentStock: '',
      minimumStock: '',
    });
  };

  const openPurchaseModal = (material) => {
    setPurchasingMaterial(material);
    setPurchaseData({
      quantity: '',
      costPerUnit: material.costPerUnit.toString(),
      supplier: '',
      notes: '',
    });
    setShowPurchaseModal(true);
  };

  const closePurchaseModal = () => {
    setShowPurchaseModal(false);
    setPurchasingMaterial(null);
    setPurchaseData({
      quantity: '',
      costPerUnit: '',
      supplier: '',
      notes: '',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brand"></div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-black mb-2">
              Raw <span className="text-brand">Materials</span>
            </h1>
            <p className="text-white/60">Manage your inventory and track costs</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="gradient-brand px-6 py-3 rounded-lg font-semibold flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Material</span>
          </motion.button>
        </div>

        {/* Low Stock Alert */}
        {materials.some(m => m.currentStock <= m.minimumStock) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-xl p-4 mb-6 border-l-4 border-yellow-500"
          >
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-yellow-500 mb-1">Low Stock Alert</h3>
                <p className="text-sm text-white/70">
                  {materials.filter(m => m.currentStock <= m.minimumStock).length} material(s) are running low on stock
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Materials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {materials.map((material) => (
            <motion.div
              key={material.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`glass rounded-xl p-6 ${
                material.currentStock <= material.minimumStock ? 'border-2 border-yellow-500/50' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-xl bg-brand/20">
                    <Package className="w-6 h-6 text-brand" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{material.name}</h3>
                    <p className="text-sm text-white/60">Unit: {material.unit}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-white/60">Cost per unit:</span>
                  <span className="font-semibold">৳{material.costPerUnit.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Current Stock:</span>
                  <span className={`font-semibold ${
                    material.currentStock <= material.minimumStock ? 'text-yellow-500' : 'text-green-500'
                  }`}>
                    {material.currentStock} {material.unit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Minimum Stock:</span>
                  <span className="font-semibold">{material.minimumStock} {material.unit}</span>
                </div>
              </div>

              {/* Stock Progress Bar */}
              <div className="mb-4">
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      material.currentStock <= material.minimumStock
                        ? 'bg-yellow-500'
                        : 'bg-gradient-to-r from-brand to-orange-400'
                    }`}
                    style={{
                      width: `${Math.min((material.currentStock / (material.minimumStock * 2)) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => openPurchaseModal(material)}
                  className="flex-1 px-3 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg text-sm font-semibold transition-all flex items-center justify-center space-x-1"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Purchase</span>
                </button>
                <button
                  onClick={() => openEditModal(material)}
                  className="flex-1 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-sm font-semibold transition-all flex items-center justify-center space-x-1"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(material.id)}
                  className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm font-semibold transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass rounded-2xl p-8 max-w-md w-full"
            >
              <h2 className="text-2xl font-black mb-6">
                {editingMaterial ? 'Edit' : 'Add'} <span className="text-brand">Material</span>
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Material Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-brand"
                    placeholder="e.g., Burger Bun"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Unit</label>
                  <input
                    type="text"
                    required
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-brand"
                    placeholder="e.g., piece, kg, liter"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Cost Per Unit (৳)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.costPerUnit}
                    onChange={(e) => setFormData({ ...formData, costPerUnit: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-brand"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Current Stock</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.currentStock}
                    onChange={(e) => setFormData({ ...formData, currentStock: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-brand"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Minimum Stock</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.minimumStock}
                    onChange={(e) => setFormData({ ...formData, minimumStock: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-brand"
                    placeholder="0"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-lg font-semibold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 gradient-brand px-6 py-3 rounded-lg font-semibold"
                  >
                    {editingMaterial ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Purchase Modal */}
        {showPurchaseModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass rounded-2xl p-8 max-w-md w-full"
            >
              <h2 className="text-2xl font-black mb-2">
                Purchase <span className="text-brand">{purchasingMaterial?.name}</span>
              </h2>
              <p className="text-white/60 mb-6 text-sm">Record a new purchase to update stock</p>
              
              <form onSubmit={handlePurchaseSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Quantity ({purchasingMaterial?.unit})</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={purchaseData.quantity}
                    onChange={(e) => setPurchaseData({ ...purchaseData, quantity: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-brand"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Cost Per Unit (৳)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={purchaseData.costPerUnit}
                    onChange={(e) => setPurchaseData({ ...purchaseData, costPerUnit: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-brand"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Supplier (Optional)</label>
                  <input
                    type="text"
                    value={purchaseData.supplier}
                    onChange={(e) => setPurchaseData({ ...purchaseData, supplier: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-brand"
                    placeholder="Supplier name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Notes (Optional)</label>
                  <textarea
                    value={purchaseData.notes}
                    onChange={(e) => setPurchaseData({ ...purchaseData, notes: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-brand"
                    placeholder="Any additional notes"
                    rows="3"
                  />
                </div>

                {/* Total Cost */}
                {purchaseData.quantity && purchaseData.costPerUnit && (
                  <div className="p-4 bg-brand/10 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Total Cost:</span>
                      <span className="text-2xl font-black text-brand">
                        ৳{(parseFloat(purchaseData.quantity) * parseFloat(purchaseData.costPerUnit)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={closePurchaseModal}
                    className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-lg font-semibold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 gradient-brand px-6 py-3 rounded-lg font-semibold"
                  >
                    Record Purchase
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageMaterials;
