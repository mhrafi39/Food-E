import { Users, Mail, Phone, MapPin, Calendar, DollarSign } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import adminApi from '../utils/adminApi';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    setLoading(true);
    // Get users and orders to calculate total spent
    const usersResult = await adminApi.getAllCustomers();
    const ordersResult = await adminApi.getAllOrders();

    if (usersResult.success && ordersResult.success) {
      const customers = usersResult.data;
      const orders = ordersResult.data || [];

      // Calculate total spent per customer
      const customersWithSpent = customers
        .filter(user => user.role === 'user') // Only include regular users
        .map(customer => {
          const customerOrders = orders.filter(order => 
            order.customerEmail?.toLowerCase() === customer.email?.toLowerCase() ||
            order.customerName === customer.name
          );
          const totalSpent = customerOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

          return {
            ...customer,
            totalSpent: totalSpent || 0,
            orderCount: customerOrders.length
          };
        })
        .sort((a, b) => b.totalSpent - a.totalSpent); // Sort by total spent descending

      setCustomers(customersWithSpent);
    }
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    fetchCustomers();
  }, []);

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
        <div className="mb-8">
          <h1 className="text-4xl font-black mb-2">
            <span className="text-brand">Customers</span>
          </h1>
          <p className="text-white/60">{customers.length} total customers</p>
        </div>

        {/* Customers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customers.map((customer, index) => (
            <div className="glass rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-brand/20 flex items-center justify-center">
                  <span className="text-xl font-bold text-brand">
                    {customer.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-brand">৳{(customer.totalSpent || 0).toFixed(2)}</p>
                  <p className="text-xs text-white/60">Total Spent</p>
                </div>
              </div>

              <h3 className="text-xl font-bold mb-1">{customer.name}</h3>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-sm text-white/60">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{customer.email}</span>
                </div>
                {customer.phoneNumber && (
                  <div className="flex items-center space-x-2 text-sm text-white/60">
                    <Phone className="w-4 h-4" />
                    <span>{customer.phoneNumber}</span>
                  </div>
                )}
                {customer.address && (
                  <div className="flex items-start space-x-2 text-sm text-white/60">
                    <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{customer.address}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2 text-sm text-white/60">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {new Date(customer.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">Orders</span>
                  <span className="font-bold">{customer.orderCount}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {customers.length === 0 && (
          <div className="glass rounded-2xl p-12 text-center">
            <Users className="w-16 h-16 mx-auto mb-4 text-white/20" />
            <p className="text-white/60">No customers found</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AdminCustomers;
