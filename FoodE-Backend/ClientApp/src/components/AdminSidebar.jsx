import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  LogOut,
  Menu,
  X,
  TrendingUp,
  Layers
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const AdminSidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const menuItems = [
    {
      path: '/admin/dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard',
    },
    {
      path: '/admin/items',
      icon: Package,
      label: 'Food Items',
    },
    {
      path: '/admin/materials',
      icon: Layers,
      label: 'Raw Materials',
    },
    {
      path: '/admin/profit',
      icon: TrendingUp,
      label: 'Profit Report',
    },
    {
      path: '/admin/orders',
      icon: ShoppingBag,
      label: 'Orders',
    },
    {
      path: '/admin/customers',
      icon: Users,
      label: 'Customers',
    },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 glass rounded-lg"
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 glass border-r border-white/10 z-40 transition-transform duration-300 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full p-6">
          {/* Logo & Admin Info */}
          <div className="mb-8">
            <h1 className="text-3xl font-black mb-1">
              <span className="text-brand">ফুড-ই</span>
            </h1>
            <p className="text-sm text-white/60">Admin Panel</p>
            
            {/* Admin User Info */}
            <div className="mt-4 p-3 bg-white/5 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{user?.name}</p>
                  <p className="text-xs text-white/60">Administrator</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'gradient-brand text-white shadow-lg shadow-brand/30'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Bottom Actions */}
          <div className="space-y-2 pt-6 border-t border-white/10">
            <NavLink
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-all"
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="font-medium">View Site</span>
            </NavLink>
            
            <button
              onClick={() => {
                logout();
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
        />
      )}
    </>
  );
};

export default AdminSidebar;
