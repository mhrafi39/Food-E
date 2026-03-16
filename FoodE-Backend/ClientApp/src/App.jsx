import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import MainLayout from './components/MainLayout';
import AdminLayout from './components/AdminLayout';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Deals from './pages/Deals';
import Checkout from './pages/Checkout';
import TrackOrder from './pages/TrackOrder';
import Login from './pages/Login';
import FoodDetail from './pages/FoodDetail';
import AdminDashboard from './pages/AdminDashboard';
import ManageItems from './pages/ManageItems';
import ItemForm from './pages/ItemForm';
import RecipeDetails from './pages/RecipeDetails';
import AdminOrders from './pages/AdminOrders';
import AdminCustomers from './pages/AdminCustomers';
import ManageMaterials from './pages/ManageMaterials';
import ProfitReport from './pages/ProfitReport';

function App() {
  return (
    <Router>
      <AnimatePresence mode="wait">
        <Routes>
          {/* User Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="menu" element={<Menu />} />
            <Route path="food/:id" element={<FoodDetail />} />
            <Route path="deals" element={<Deals />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="track" element={<TrackOrder />} />
            <Route path="login" element={<Login />} />
          </Route>

          {/* Admin Routes with Sidebar */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="items" element={<ManageItems />} />
            <Route path="items/new" element={<ItemForm />} />
            <Route path="items/edit/:id" element={<ItemForm />} />
            <Route path="items/:id/recipe" element={<RecipeDetails />} />
            <Route path="materials" element={<ManageMaterials />} />
            <Route path="profit" element={<ProfitReport />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="customers" element={<AdminCustomers />} />
          </Route>
        </Routes>
      </AnimatePresence>
    </Router>
  );
}

export default App;

