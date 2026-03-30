import { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Package, Calendar } from 'lucide-react';
/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion';
import adminApi from '../utils/adminApi';
import { Line } from 'react-chartjs-2';

const ProfitReport = () => {
  const [dailyProfit, setDailyProfit] = useState(null);
  const [weeklyProfit, setWeeklyProfit] = useState(null);
  const [materialsUsage, setMaterialsUsage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchProfitData = async () => {
    setLoading(true);

    // Fetch daily profit
    const dailyResult = await adminApi.getDailyProfit(selectedDate);
    if (dailyResult.success) {
      setDailyProfit(dailyResult.data);
    }

    // Fetch weekly profit
    const weeklyResult = await adminApi.getWeeklyProfit();
    if (weeklyResult.success) {
      setWeeklyProfit(weeklyResult.data);
    }

    // Fetch materials usage
    try {
      const endDate = new Date(selectedDate);
      endDate.setDate(endDate.getDate() + 1);
      const materialsResult = await adminApi.getMaterialsUsage(
        selectedDate,
        endDate.toISOString().split('T')[0]
      );
      if (materialsResult.success) {
        setMaterialsUsage(materialsResult.data);
      } else {
        console.warn('Materials usage fetch failed:', materialsResult.error);
        setMaterialsUsage({ materialsUsed: [], totalMaterialCost: 0 });
      }
    } catch (error) {
      console.error('Error fetching materials usage:', error);
      setMaterialsUsage({ materialsUsed: [], totalMaterialCost: 0 });
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchProfitData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brand"></div>
      </div>
    );
  }

  // Weekly profit chart data
  const weeklyChartData = weeklyProfit
    ? {
        labels: weeklyProfit.dailyData.map((d) => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
        datasets: [
          {
            label: 'Profit (৳)',
            data: weeklyProfit.dailyData.map((d) => d.totalProfit),
            borderColor: 'rgb(34, 197, 94)',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            tension: 0.4,
          },
          {
            label: 'Revenue (৳)',
            data: weeklyProfit.dailyData.map((d) => d.totalRevenue),
            borderColor: 'rgb(249, 115, 22)',
            backgroundColor: 'rgba(249, 115, 22, 0.1)',
            tension: 0.4,
          },
          {
            label: 'Cost (৳)',
            data: weeklyProfit.dailyData.map((d) => d.totalCost),
            borderColor: 'rgb(239, 68, 68)',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            tension: 0.4,
          },
        ],
      }
    : null;

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black mb-2">
            Profit <span className="text-brand">Report</span>
          </h1>
          <p className="text-white/60">Track your earnings and costs</p>
        </div>

        {/* Date Picker */}
        <div className="glass rounded-xl p-4 mb-6 flex items-center space-x-4">
          <Calendar className="w-5 h-5 text-brand" />
          <label className="font-semibold">Select Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-brand"
          />
        </div>

        {/* Daily Stats Cards */}
        {dailyProfit && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="glass rounded-2xl p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-green-500/20">
                  <TrendingUp className="w-8 h-8 text-green-500" />
                </div>
              </div>
              <h3 className="text-3xl font-black mb-1">৳{dailyProfit.totalProfit.toFixed(2)}</h3>
              <p className="text-white/60 text-sm">Total Profit</p>
              <p className="text-white/40 text-xs mt-1">
                {dailyProfit.profitMargin.toFixed(1)}% margin
              </p>
            </motion.div>

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-2xl p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-blue-500/20">
                  <DollarSign className="w-8 h-8 text-blue-500" />
                </div>
              </div>
              <h3 className="text-3xl font-black mb-1">৳{dailyProfit.totalRevenue.toFixed(2)}</h3>
              <p className="text-white/60 text-sm">Total Revenue</p>
            </motion.div>

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-2xl p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-red-500/20">
                  <Package className="w-8 h-8 text-red-500" />
                </div>
              </div>
              <h3 className="text-3xl font-black mb-1">৳{dailyProfit.totalCost.toFixed(2)}</h3>
              <p className="text-white/60 text-sm">Total Cost</p>
            </motion.div>

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="glass rounded-2xl p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-orange-500/20">
                  <Package className="w-8 h-8 text-orange-500" />
                </div>
              </div>
              <h3 className="text-3xl font-black mb-1">{dailyProfit.totalOrders}</h3>
              <p className="text-white/60 text-sm">Total Orders</p>
            </motion.div>
          </div>
        )}

        {/* Weekly Trend Chart */}
        {weeklyProfit && weeklyChartData && (
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="glass rounded-2xl p-6 mb-8"
          >
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">7-Day Trend</h3>
              <div className="flex flex-wrap gap-4 text-sm">
                <div>
                  <span className="text-white/60">Total Profit: </span>
                  <span className="font-semibold text-green-500">৳{weeklyProfit.totalProfit.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-white/60">Total Revenue: </span>
                  <span className="font-semibold text-brand">৳{weeklyProfit.totalRevenue.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-white/60">Total Cost: </span>
                  <span className="font-semibold text-red-400">৳{weeklyProfit.totalCost.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <Line
              data={weeklyChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top' },
                },
                scales: {
                  y: { beginAtZero: true },
                },
              }}
            />
          </motion.div>
        )}

        {/* Item Breakdown */}
        {dailyProfit && dailyProfit.itemBreakdown && dailyProfit.itemBreakdown.length > 0 && (
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="glass rounded-2xl p-6 mb-8"
          >
            <h3 className="text-2xl font-bold mb-6">Item-wise Profit Breakdown</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4">Item</th>
                    <th className="text-center py-3 px-4">Sold</th>
                    <th className="text-right py-3 px-4">Revenue</th>
                    <th className="text-right py-3 px-4">Cost</th>
                    <th className="text-right py-3 px-4">Profit</th>
                    <th className="text-right py-3 px-4">Margin</th>
                  </tr>
                </thead>
                <tbody>
                  {dailyProfit.itemBreakdown.map((item) => (
                    <tr key={item.foodItemId} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-3 px-4 font-semibold">{item.foodItemName}</td>
                      <td className="py-3 px-4 text-center">{item.quantitySold}</td>
                      <td className="py-3 px-4 text-right">৳{item.revenue.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right text-red-400">৳{item.cost.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right font-bold text-green-500">
                        ৳{item.profit.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right text-white/60">
                        {((item.profit / item.revenue) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Materials Usage */}
        {materialsUsage && materialsUsage.materialsUsed && materialsUsage.materialsUsed.length > 0 && (
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="glass rounded-2xl p-6"
          >
            <h3 className="text-2xl font-bold mb-2">Raw Materials Usage</h3>
            <p className="text-white/60 text-sm mb-6">
              Total Material Cost: <span className="font-bold text-red-400">৳{materialsUsage.totalMaterialCost.toFixed(2)}</span>
            </p>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4">Material</th>
                    <th className="text-center py-3 px-4">Unit</th>
                    <th className="text-right py-3 px-4">Used</th>
                    <th className="text-right py-3 px-4">Cost/Unit</th>
                    <th className="text-right py-3 px-4">Total Cost</th>
                    <th className="text-right py-3 px-4">Stock Left</th>
                  </tr>
                </thead>
                <tbody>
                  {materialsUsage.materialsUsed.map((material) => (
                    <tr key={material.materialId} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-3 px-4 font-semibold">{material.materialName}</td>
                      <td className="py-3 px-4 text-center text-white/60">{material.unit}</td>
                      <td className="py-3 px-4 text-right">{material.quantityUsed.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right">৳{material.costPerUnit.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right font-bold text-red-400">
                        ৳{material.totalCost.toFixed(2)}
                      </td>
                      <td className={`py-3 px-4 text-right ${
                        material.currentStock < 10 ? 'text-yellow-500' : 'text-white/60'
                      }`}>
                        {material.currentStock.toFixed(2)} {material.unit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* No Data State */}
        {dailyProfit && dailyProfit.totalOrders === 0 && (
          <div className="glass rounded-2xl p-12 text-center">
            <Package className="w-16 h-16 mx-auto mb-4 text-white/20" />
            <h3 className="text-xl font-bold mb-2">No Sales Data</h3>
            <p className="text-white/60">There are no orders for the selected date</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfitReport;
