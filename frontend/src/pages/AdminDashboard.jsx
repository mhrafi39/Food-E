import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  DollarSign,
  Package,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import adminApi from '../utils/adminApi';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is admin
    if (!user || user.role !== 'Admin') {
      navigate('/admin/login');
      return;
    }

    const fetchDashboard = async () => {
      setLoading(true);
      const result = await adminApi.getDashboard();
      if (result.success) {
        setStats(result.data);
      }
      setLoading(false);
    };

    fetchDashboard();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brand"></div>
      </div>
    );
  }

  if (!stats) {
    return <div className="min-h-screen flex items-center justify-center">No data available</div>;
  }

  // Prepare chart data
  const salesChartData = {
    labels: stats.dailySales.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: 'Revenue (৳)',
        data: stats.dailySales.map(d => d.revenue),
        borderColor: 'rgb(249, 115, 22)',
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const orderStatusData = {
    labels: stats.ordersByStatus.map(s => s.status),
    datasets: [
      {
        data: stats.ordersByStatus.map(s => s.count),
        backgroundColor: [
          'rgba(249, 115, 22, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(168, 85, 247, 0.8)',
        ],
      },
    ],
  };

  const statsCards = [
    {
      title: 'Total Revenue',
      value: `৳${stats.totalRevenue.toFixed(2)}`,
      icon: <DollarSign className="w-8 h-8" />,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: <ShoppingBag className="w-8 h-8" />,
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Total Customers',
      value: stats.totalCustomers,
      icon: <Users className="w-8 h-8" />,
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-500/10',
    },
    {
      title: 'Menu Items',
      value: stats.totalItems,
      icon: <Package className="w-8 h-8" />,
      color: 'from-orange-500 to-red-600',
      bgColor: 'bg-orange-500/10',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen p-6 md:p-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-black mb-2">
            Admin <span className="text-brand">Dashboard</span>
          </h1>
          <p className="text-white/60">Welcome back, {user?.name}</p>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Link
            to="/admin/items"
            className="glass p-4 rounded-xl hover:scale-105 transition-transform"
          >
            <Package className="w-6 h-6 text-brand mb-2" />
            <p className="font-semibold">Manage Items</p>
          </Link>
          <Link
            to="/admin/orders"
            className="glass p-4 rounded-xl hover:scale-105 transition-transform"
          >
            <ShoppingBag className="w-6 h-6 text-brand mb-2" />
            <p className="font-semibold">View Orders</p>
          </Link>
          <Link
            to="/admin/customers"
            className="glass p-4 rounded-xl hover:scale-105 transition-transform"
          >
            <Users className="w-6 h-6 text-brand mb-2" />
            <p className="font-semibold">Customers</p>
          </Link>
          <Link
            to="/"
            className="glass p-4 rounded-xl hover:scale-105 transition-transform"
          >
            <LayoutDashboard className="w-6 h-6 text-brand mb-2" />
            <p className="font-semibold">View Site</p>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-2xl p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <div className={`bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`}>
                    {stat.icon}
                  </div>
                </div>
              </div>
              <h3 className="text-3xl font-black mb-1">{stat.value}</h3>
              <p className="text-white/60 text-sm">{stat.title}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Sales Chart */}
          <div className="lg:col-span-2 glass rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-brand" />
              Sales Trend (Last 30 Days)
            </h3>
            <Line
              data={salesChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                },
                scales: {
                  y: { beginAtZero: true },
                },
              }}
            />
          </div>

          {/* Order Status */}
          <div className="glass rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-4">Order Status</h3>
            <Doughnut
              data={orderStatusData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'bottom' },
                },
              }}
            />
          </div>
        </div>

        {/* Top Selling Items & Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Selling Items */}
          <div className="glass rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-brand" />
              Top Selling Items
            </h3>
            <div className="space-y-3">
              {stats.topSellingItems.map((item, index) => (
                <div key={item.foodItemId} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center">
                      <span className="font-bold text-brand">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-xs text-white/60">{item.totalQuantity} sold</p>
                    </div>
                  </div>
                  <p className="font-bold text-brand">৳{item.totalRevenue.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="glass rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-brand" />
              Recent Orders
            </h3>
            <div className="space-y-3">
              {stats.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div>
                    <p className="font-semibold">Order #{order.id}</p>
                    <p className="text-xs text-white/60">{order.customerName} • {order.itemCount} items</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-brand">৳{order.totalAmount}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'Delivered' ? 'bg-green-500/20 text-green-300' :
                      order.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-blue-500/20 text-blue-300'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
