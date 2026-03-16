import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminSidebar from './AdminSidebar';

const AdminLayout = () => {
  const { user, isAuthenticated } = useAuth();

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to home if not admin
  if (user?.role !== 'admin' && user?.role !== 'Admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex bg-matte">
      <AdminSidebar />
      
      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
