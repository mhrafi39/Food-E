import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, User, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { getTotalItems, setIsCartOpen } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/menu', label: 'Menu' },
    { to: '/deals', label: 'Deals' },
    { to: '/track', label: 'Track Order' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="glass sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl md:text-3xl font-black text-brand">
                ফুড-ই
              </span>
              <div className="hidden md:flex items-center">
                <span className="relative flex h-3 w-3 ml-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="ml-2 text-sm font-semibold text-green-400">
                  Open Now
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`font-medium transition-colors ${
                    isActive(link.to)
                      ? 'text-brand'
                      : 'text-white hover:text-brand'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* User, Cart & Mobile Menu */}
            <div className="flex items-center space-x-4">
              {/* User Menu - Desktop */}
              {isAuthenticated ? (
                <div className="hidden md:flex items-center space-x-3">
                  <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/10">
                    <User className="w-4 h-4 text-brand" />
                    <span className="text-sm font-medium">{user.name}</span>
                  </div>
                  <button
                    onClick={logout}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="hidden md:flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-brand transition-colors font-medium"
                >
                  <User className="w-4 h-4" />
                  <span>Login</span>
                </Link>
              )}
              {/* Cart Icon */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <ShoppingCart className="w-6 h-6" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="md:hidden fixed top-0 right-0 h-full w-64 bg-matte border-l border-white/20 z-50 shadow-2xl"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <span className="text-2xl font-black text-brand">ফুড-ই</span>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-lg hover:bg-white/10"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Open Badge */}
                <div className="flex items-center mb-8 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                  <span className="ml-2 text-sm font-semibold text-green-400">
                    Open Now
                  </span>
                </div>

                {/* User Info - Mobile */}
                {isAuthenticated ? (
                  <div className="mb-6 p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-semibold">{user.name}</p>
                          <p className="text-xs text-white/60">{user.phone}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          logout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="p-2 rounded-lg hover:bg-white/10"
                      >
                        <LogOut className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="mb-6 flex items-center justify-center space-x-2 p-3 rounded-lg bg-brand text-white font-semibold"
                  >
                    <User className="w-5 h-5" />
                    <span>Login / Sign Up</span>
                  </Link>
                )}

                {/* Nav Links */}
                <div className="space-y-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block py-3 px-4 rounded-lg font-medium transition-colors ${
                        isActive(link.to)
                          ? 'bg-brand text-white'
                          : 'text-white/80 hover:bg-white/10'
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
