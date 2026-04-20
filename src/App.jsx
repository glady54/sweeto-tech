import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

// Providers
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { ToastProvider } from './contexts/ToastContext';
import { LocaleProvider } from './contexts/LocaleContext';
import { AdminAuthProvider } from './contexts/AdminAuthContext';
import { AdminLocaleProvider } from './contexts/AdminLocaleContext';
import { UserAuthProvider, useUserAuth } from './contexts/UserAuthContext'; // Customer Authentication

// Analytics
import analyticsService from './utils/analyticsService';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import QRShareButton from './components/QRShareButton';
import FloatingCartButton from './components/FloatingCartButton';
import Toast from './components/Toast';
import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';

// Public Pages
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ProductDetailPage from './pages/ProductDetailPage';
import SearchPage from './pages/SearchPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import CustomerLoginPage from './pages/CustomerLoginPage';
import CustomerRegisterPage from './pages/CustomerRegisterPage';

// Admin Pages
import LoginPage from './pages/admin/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import ProductManagerPage from './pages/admin/ProductManagerPage';
import CategoryManagerPage from './pages/admin/CategoryManagerPage';
import StoreSettingsPage from './pages/admin/StoreSettingsPage';
import StockManagementPage from './pages/admin/StockManagementPage';
import SalesHistoryPage from './pages/admin/SalesHistoryPage';
import AnalyticsPage from './pages/admin/AnalyticsPage';
import MigratePage from './pages/admin/MigratePage';
import VideoAdsPage from './pages/admin/VideoAdsPage';

const AnalyticsTracker = () => {
  const location = useLocation();
  const { user } = useUserAuth();

  useEffect(() => {
    // Only log paths that are not the admin panel
    if (!location.pathname.startsWith('/admin')) {
      analyticsService.logVisit(location.pathname, user);
    }
  }, [location, user]);

  return null;
};

function App() {
  return (
    <LocaleProvider>
      <ToastProvider>
        <UserAuthProvider>
          <WishlistProvider>
            <CartProvider>
              <AdminLocaleProvider>
                <AdminAuthProvider>
                  <AnalyticsTracker />
                <Routes>
                  {/* Storefront Routes */}
                  <Route path="/" element={
                    <div className="min-h-screen flex flex-col">
                      <Header />
                      <main className="flex-grow">
                        <HomePage />
                      </main>
                      <Footer />
                      <QRShareButton />
                      <FloatingCartButton />
                      <Toast />
                    </div>
                  } />
                  <Route path="/category/:categoryName" element={
                    <div className="min-h-screen flex flex-col">
                      <Header />
                      <main className="flex-grow">
                        <CategoryPage />
                      </main>
                      <Footer />
                      <QRShareButton />
                      <FloatingCartButton />
                      <Toast />
                    </div>
                  } />
                  <Route path="/product/:productId" element={
                    <div className="min-h-screen flex flex-col">
                      <Header />
                      <main className="flex-grow">
                        <ProductDetailPage />
                      </main>
                      <Footer />
                      <QRShareButton />
                      <FloatingCartButton />
                      <Toast />
                    </div>
                  } />
                  <Route path="/search" element={
                    <div className="min-h-screen flex flex-col">
                      <Header />
                      <main className="flex-grow">
                        <SearchPage />
                      </main>
                      <Footer />
                      <QRShareButton />
                      <FloatingCartButton />
                      <Toast />
                    </div>
                  } />
                  <Route path="/cart" element={
                    <div className="min-h-screen flex flex-col">
                      <Header />
                      <main className="flex-grow">
                        <CartPage />
                      </main>
                      <Footer />
                      <QRShareButton />
                      <FloatingCartButton />
                      <Toast />
                    </div>
                  } />
                  <Route path="/wishlist" element={
                    <div className="min-h-screen flex flex-col">
                      <Header />
                      <main className="flex-grow">
                        <WishlistPage />
                      </main>
                      <Footer />
                      <QRShareButton />
                      <FloatingCartButton />
                      <Toast />
                    </div>
                  } />
                  <Route path="/login" element={
                    <div className="min-h-screen flex flex-col">
                      <Header />
                      <main className="flex-grow">
                        <CustomerLoginPage />
                      </main>
                      <Footer />
                      <Toast />
                    </div>
                  } />
                  <Route path="/register" element={
                    <div className="min-h-screen flex flex-col">
                      <Header />
                      <main className="flex-grow">
                        <CustomerRegisterPage />
                      </main>
                      <Footer />
                      <Toast />
                    </div>
                  } />

                  {/* Admin Routes */}
                  <Route path="/admin/login" element={<LoginPage />} />
                  
                  <Route path="/admin" element={
                    <ProtectedRoute>
                      <AdminLayout />
                    </ProtectedRoute>
                  }>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="products" element={<ProductManagerPage />} />
                    <Route path="products/add" element={<ProductManagerPage />} />
                    <Route path="products/edit/:id" element={<ProductManagerPage />} />
                    <Route path="categories" element={<CategoryManagerPage />} />
                    <Route path="categories/add" element={<CategoryManagerPage />} />
                    <Route path="categories/edit/:id" element={<CategoryManagerPage />} />
                    <Route path="stock" element={<StockManagementPage />} />
                    <Route path="sales" element={<SalesHistoryPage />} />
                    <Route path="settings" element={<StoreSettingsPage />} />
                    <Route path="migrate" element={<MigratePage />} />
                    <Route path="analytics" element={<AnalyticsPage />} />
                    <Route path="video-ads" element={<VideoAdsPage />} />
                  </Route>

                  {/* Universal Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </AdminAuthProvider>
            </AdminLocaleProvider>
          </CartProvider>
        </WishlistProvider>
      </UserAuthProvider>
    </ToastProvider>
    </LocaleProvider>
  );
}

export default App;
