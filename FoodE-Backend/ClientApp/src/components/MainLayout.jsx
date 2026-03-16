import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import CartSidebar from './CartSidebar';
import FloatingWhatsApp from './FloatingWhatsApp';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-matte">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartSidebar />
      <FloatingWhatsApp />
    </div>
  );
};

export default MainLayout;
