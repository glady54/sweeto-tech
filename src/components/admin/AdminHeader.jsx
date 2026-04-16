import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { useAdminLocale } from '../../contexts/AdminLocaleContext';
import { useStoreData } from '../../contexts/StoreDataContext';
import { useTheme } from '../../contexts/ThemeContext';
import { LogOut, Globe, Settings, Package, Grid3x3, Home, Sun, Moon, Warehouse, Receipt, MousePointer2 } from 'lucide-react';

const AdminHeader = () => {
  const { user, logout } = useAdminAuth();
  const { t, language, toggleLanguage } = useAdminLocale();
  const { storeSettings } = useStoreData();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg shadow-blue-500/5 border-b border-gray-100 dark:border-slate-800 sticky top-0 z-50 transition-all duration-500">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo and Shop Name */}
          <div className="flex items-center group cursor-pointer" onClick={() => navigate('/admin/dashboard')}>
            <div className="relative">
              {storeSettings.shopLogo ? (
                <img 
                  src={storeSettings.shopLogo} 
                  alt={storeSettings.shopName}
                  className="h-10 w-10 rounded-xl mr-4 object-cover shadow-lg group-hover:rotate-6 transition-transform"
                />
              ) : (
                <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl mr-4 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:rotate-6 transition-transform">
                  <Package className="h-6 w-6 text-white" />
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full" />
            </div>
            <div>
              <span className="text-xl font-black text-gray-900 dark:text-white tracking-tighter uppercase italic translate-y-0.5 inline-block group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {storeSettings.shopName}
              </span>
              <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest -mt-1 opacity-60">Admin Central</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center bg-gray-50/50 dark:bg-slate-950/50 p-1.5 rounded-2xl border border-gray-100 dark:border-slate-800/50">
            {[
              { to: '/admin/dashboard', icon: Home, label: t('dashboard') },
              { to: '/admin/products', icon: Package, label: t('productManagement') },
              { to: '/admin/categories', icon: Grid3x3, label: t('categoryManagement') },
              { to: '/admin/stock', icon: Warehouse, label: t('stockManagement') },
              { to: '/admin/sales', icon: Receipt, label: t('salesHistory') },
              { to: '/admin/analytics', icon: MousePointer2, label: 'Analytics' },
              { to: '/admin/settings', icon: Settings, label: t('storeSettings') },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest text-gray-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-900 transition-all active:scale-95"
              >
                <item.icon size={16} className="mr-2" />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-gray-50 dark:bg-slate-950 p-1 rounded-xl border border-gray-100 dark:border-slate-800">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2.5 text-gray-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-900 rounded-lg transition-all"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <div className="w-px h-4 bg-gray-200 dark:bg-slate-800 mx-1" />

              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className="flex items-center text-gray-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-900 px-3 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
                title={t('adminPanelLanguage')}
              >
                <Globe size={16} className="mr-1.5 text-blue-500" />
                {language === 'en' ? 'EN' : 'FR'}
              </button>
            </div>

            <div className="h-10 w-px bg-gray-100 dark:bg-slate-800 hidden sm:block mx-2" />

            {/* User Info & Logout */}
            <div className="flex items-center">
              <div className="hidden sm:flex flex-col items-end mr-4 group">
                <span className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">Logged as</span>
                <span className="text-sm font-black text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">{user?.username}</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-3.5 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-red-500/5 flex items-center group active:scale-95"
              >
                <LogOut size={18} className="group-hover:rotate-12 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-950/50 overflow-x-auto">
        <div className="px-4 py-3 flex space-x-2">
          {[
            { to: '/admin/dashboard', icon: Home, label: t('dashboard') },
            { to: '/admin/products', icon: Package, label: t('productManagement') },
            { to: '/admin/categories', icon: Grid3x3, label: t('categoryManagement') },
            { to: '/admin/stock', icon: Warehouse, label: t('stockManagement') },
            { to: '/admin/sales', icon: Receipt, label: t('salesHistory') },
            { to: '/admin/analytics', icon: MousePointer2, label: 'Analytics' },
            { to: '/admin/settings', icon: Settings, label: t('storeSettings') },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex-shrink-0 flex items-center px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-900 border border-transparent hover:border-gray-100 dark:hover:border-slate-800 transition-all active:scale-95"
            >
              <item.icon size={14} className="mr-2" />
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
