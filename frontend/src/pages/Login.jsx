import { motion } from 'framer-motion';
import { LogIn, UserPlus, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    address: '',
  });
  const [errorMsg, setErrorMsg] = useState('');
  const { login, register, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already authenticated
  if (isAuthenticated) {
    const from = location.state?.from?.pathname || '/';
    navigate(from, { replace: true });
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (isLogin) {
      // Login validation
      if (!formData.email || !formData.password) {
        setErrorMsg('Please enter email and password');
        return;
      }

      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        // Redirect to intended page or home
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      } else {
        setErrorMsg(result.error || 'Login failed');
      }
    } else {
      // Signup validation
      if (!formData.name || !formData.email || !formData.password) {
        setErrorMsg('Please fill in all required fields');
        return;
      }

      const result = await register(
        formData.name,
        formData.email,
        formData.password,
        formData.phoneNumber,
        formData.address
      );
      
      if (result.success) {
        // Redirect to intended page or home
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      } else {
        setErrorMsg(result.error || 'Registration failed');
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-12 min-h-[calc(100vh-200px)] flex items-center justify-center"
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
            <h1 className="text-4xl font-black mb-2">
              <span className="text-brand">ফুড-ই</span>
            </h1>
            <p className="text-white/60">
              {isLogin ? 'Welcome back!' : 'Create your account'}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex space-x-2 mb-8">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                isLogin
                  ? 'gradient-brand text-white'
                  : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                !isLogin
                  ? 'gradient-brand text-white'
                  : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400"
            >
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">{errorMsg}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required={!isLogin}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-brand focus:outline-none transition-colors"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">
                Email {!isLogin && '*'}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-brand focus:outline-none transition-colors"
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="+880 1XXX-XXXXXX"
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-brand focus:outline-none transition-colors"
                />
              </div>
            )}

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Your delivery address"
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-brand focus:outline-none transition-colors"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-brand focus:outline-none transition-colors"
              />
            </div>

            {isLogin && (
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm text-brand hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 gradient-brand rounded-lg font-bold text-lg shadow-lg shadow-brand/50 hover:shadow-brand/70 transition-all hover:scale-105 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{isLogin ? 'Logging in...' : 'Signing up...'}</span>
                </>
              ) : isLogin ? (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Login</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>Sign Up</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-white/10"></div>
            <span className="px-4 text-white/40 text-sm">OR</span>
            <div className="flex-1 border-t border-white/10"></div>
          </div>

          {/* Social Login */}
          <div className="space-y-3">
            <button className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2">
              <span>Continue with Google</span>
            </button>
            <button className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2">
              <span>Continue with Facebook</span>
            </button>
          </div>

          {/* Note */}
          <p className="text-center text-white/40 text-sm mt-6">
            {isLogin ? 'New here? Switch to Sign Up!' : 'Already have an account? Switch to Login!'}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Login;
