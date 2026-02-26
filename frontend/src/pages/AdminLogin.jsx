import { motion } from 'framer-motion';
import { Shield, LogIn, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errorMsg, setErrorMsg] = useState('');
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.email || !formData.password) {
      setErrorMsg('Please enter email and password');
      return;
    }

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      // Check if user is admin after login
      const userData = JSON.parse(localStorage.getItem('food-e-user'));
      if (userData && userData.role === 'Admin') {
        navigate('/admin/dashboard');
      } else {
        setErrorMsg('Access denied. Admin credentials required.');
      }
    } else {
      setErrorMsg(result.error || 'Login failed');
    }
  };

  // Redirect if already logged in as admin
  if (user && user.role === 'Admin') {
    navigate('/admin/dashboard');
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center px-4 py-12"
    >
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-md"
      >
        <div className="glass rounded-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-brand/20 rounded-full mb-4">
              <Shield className="w-8 h-8 text-brand" />
            </div>
            <h1 className="text-4xl font-black mb-2">
              Admin <span className="text-brand">Portal</span>
            </h1>
            <p className="text-white/60">
              Sign in to access the admin dashboard
            </p>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start space-x-3"
            >
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-300 text-sm">{errorMsg}</p>
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Admin Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@foode.com"
                required
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-brand focus:outline-none transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-brand focus:outline-none transition-colors"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 gradient-brand rounded-lg font-bold flex items-center justify-center space-x-2 hover:scale-105 transition-transform shadow-lg shadow-brand/30"
            >
              <LogIn className="w-5 h-5" />
              <span>Sign In</span>
            </button>
          </form>

          {/* Info */}
          <div className="mt-6 text-center">
            <p className="text-xs text-white/40">
              For authorized personnel only
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminLogin;
