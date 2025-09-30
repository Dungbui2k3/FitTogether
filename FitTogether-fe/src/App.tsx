import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import PurchaseHistoryPage from "./pages/PurchaseHistoryPage";
import PaymentSuccessPage from "./pages/Payment/PaymentSuccessPage";
import PaymentCancelPage from "./pages/Payment/PaymentCancelPage";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import UserManagement from "./pages/Admin/UserManagement";
import OrderManagement from "./pages/Admin/OrderManagement";
import CategoryManagement from "./pages/Admin/CategoryManagement";
import ProductManagement from "./pages/Admin/ProductManagement";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/Admin/AdminRoute";
import AdminLayout from "./components/Admin/AdminLayout";
import Header from "./components/Home/Header";
import Footer from "./components/Home/Footer";
import { CartProvider } from "./context/CartContext";

// Layout có Header/Footer
const MainLayout = () => {
  const handleViewChange = (_view: string, _productId?: string) => {
    // This function is not used in the new routing structure
    // but kept for compatibility with Header component
  };

  return (
    <div className="min-h-screen">
      <Header onViewChange={handleViewChange} />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

// Layout cho Admin
const AdminLayoutWrapper = () => {
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
};

function App() {
  return (
      <CartProvider>
      <Router>
        <Routes>
          {/* Routes với Header/Footer */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="product/:id" element={<ProductDetailPage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="checkout" element={<CheckoutPage />} />
              <Route path="order-success" element={<OrderSuccessPage />} />
              <Route path="payment/success" element={<PaymentSuccessPage />} />
              <Route path="payment/cancel" element={<PaymentCancelPage />} />
              <Route
                path="purchase-history"
                element={
                  <ProtectedRoute>
                    <PurchaseHistoryPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
            </Route>
          
          {/* Admin Routes với AdminLayout */}
          <Route path="/admin" element={
            <AdminRoute>
              <AdminLayoutWrapper />
            </AdminRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="orders" element={<OrderManagement />} />
            <Route path="categories" element={<CategoryManagement />} />
          </Route>
          
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
      </CartProvider>
  );
}

export default App;
