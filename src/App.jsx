import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Providers
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { ToastProvider } from './contexts/ToastContext';
import { LocaleProvider } from './contexts/LocaleContext';
import { AdminAuthProvider } from './contexts/AdminAuthContext';
import { AdminLocaleProvider } from './contexts/AdminLocaleContext';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import QRShareButton from './components/QRShareButton';
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

// Admin Pages
import LoginPage from './pages/admin/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import ProductManagerPage from './pages/admin/ProductManagerPage';
import CategoryManagerPage from './pages/admin/CategoryManagerPage';
import StoreSettingsPage from './pages/admin/StoreSettingsPage';
import StockManagementPage from './pages/admin/StockManagementPage';
import SalesHistoryPage from './pages/admin/SalesHistoryPage';

function App() {
  return (
    <LocaleProvider>
      <ToastProvider>
        <WishlistProvider>
          <CartProvider>
            <AdminLocaleProvider>
              <AdminAuthProvider>
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
                  </Route>

                  {/* Universal Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </AdminAuthProvider>
            </AdminLocaleProvider>
          </CartProvider>
        </WishlistProvider>
      </ToastProvider>
    </LocaleProvider>
  );
}

export default App;
