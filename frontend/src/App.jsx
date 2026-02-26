import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import MainLayout from './components/MainLayout';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Deals from './pages/Deals';
import Checkout from './pages/Checkout';
import TrackOrder from './pages/TrackOrder';
import Login from './pages/Login';
import FoodDetail from './pages/FoodDetail';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ManageItems from './pages/ManageItems';
import ItemForm from './pages/ItemForm';
import AdminOrders from './pages/AdminOrders';
import AdminCustomers from './pages/AdminCustomers';

function App() {
  return (
    <Router>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="menu" element={<Menu />} />
            <Route path="food/:id" element={<FoodDetail />} />
            <Route path="deals" element={<Deals />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="track" element={<TrackOrder />} />
            <Route path="login" element={<Login />} />
          </Route>
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/items" element={<ManageItems />} />
          <Route path="/admin/items/new" element={<ItemForm />} />
          <Route path="/admin/items/edit/:id" element={<ItemForm />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/customers" element={<AdminCustomers />} />
        </Routes>
      </AnimatePresence>
    </Router>
  );
}

export default App;

