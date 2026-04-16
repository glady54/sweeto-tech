import React from 'react';
import { Link } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { useAdminLocale } from '../../contexts/AdminLocaleContext';
import { useStoreData } from '../../contexts/StoreDataContext';
import { Package, Grid3x3, Settings, Plus, Edit, Trash2, TrendingUp, Users, ShoppingCart, Warehouse, Receipt, AlertTriangle } from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAdminAuth();
  const { t } = useAdminLocale();
  const { products, categories, storeSettings, formatPrice, salesRecords } = useStoreData();

  const lowStockProducts = products.filter(p => (p.lowStockThreshold || 0) > 0 && (p.stockQuantity || 0) <= (p.lowStockThreshold || 0));

  const stats = {
    totalProducts: products.length,
    activeProducts: products.filter(p => p.status === 'active').length,
    totalCategories: categories.length,
    totalOrders: salesRecords.length,
    totalRevenue: salesRecords.reduce((sum, r) => sum + (r.totalPrice || 0), 0),
    lowStockCount: lowStockProducts.length
  };

  const quickActions = [
    {
      title: t('addProduct'),
      description: 'Add a new product to your store',
      icon: Plus,
      link: '/admin/products/add',
      color: 'bg-blue-500'
    },
    {
      title: t('addCategory'),
      description: 'Create a new product category',
      icon: Plus,
      link: '/admin/categories/add',
      color: 'bg-green-500'
    },
    {
      title: t('manageStock'),
      description: 'Manage inventory & stock levels',
      icon: Warehouse,
      link: '/admin/stock',
      color: 'bg-amber-500'
    },
    {
      title: t('recordSale'),
      description: 'Record a new sale transaction',
      icon: Receipt,
      link: '/admin/sales',
      color: 'bg-purple-500'
    },
    {
      title: t('storeSettings'),
      description: 'Configure your store settings',
      icon: Settings,
      link: '/admin/settings',
      color: 'bg-slate-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-500">
      {/* Welcome Header */}
      <div className="bg-white dark:bg-slate-900 shadow-sm border-b border-gray-200 dark:border-slate-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div>
              <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                {t('welcome')}, <span className="text-blue-600 dark:text-blue-400">{user?.username}!</span>
              </h1>
              <p className="text-gray-500 dark:text-gray-400 font-medium">{storeSettings.storeTagline}</p>
            </div>
            <div className="bg-gray-50 dark:bg-slate-950 p-4 rounded-2xl border border-gray-100 dark:border-slate-800 flex items-center space-x-6">
              <div className="text-right">
                <p className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-slate-500">Active Store</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">{storeSettings.shopName}</p>
              </div>
              <div className="w-px h-8 bg-gray-200 dark:bg-slate-800" />
              <div className="text-right">
                <p className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-slate-500">Locale & Currency</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  {storeSettings.adminLanguage === 'en' ? 'EN' : 'FR'} | {storeSettings.defaultCurrency}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 dark:border-slate-800 group">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 group-hover:scale-110 transition-transform">
                <Package className="h-7 w-7 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-5">
                <p className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-slate-500 mb-1">Total Products</p>
                <p className="text-3xl font-black text-gray-900 dark:text-white font-mono">{stats.totalProducts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 dark:border-slate-800 group">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-50 dark:bg-green-900/20 rounded-2xl p-4 group-hover:scale-110 transition-transform">
                <Grid3x3 className="h-7 w-7 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-5">
                <p className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-slate-500 mb-1">Categories</p>
                <p className="text-3xl font-black text-gray-900 dark:text-white font-mono">{stats.totalCategories}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 dark:border-slate-800 group">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-4 group-hover:scale-110 transition-transform">
                <ShoppingCart className="h-7 w-7 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-5">
                <p className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-slate-500 mb-1">Total Sales</p>
                <p className="text-3xl font-black text-gray-900 dark:text-white font-mono">{stats.totalOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 dark:border-slate-800 group">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="h-7 w-7 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="ml-5">
                <p className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-slate-500 mb-1">Revenue</p>
                <p className="text-2xl font-black text-gray-900 dark:text-white font-mono">{formatPrice(stats.totalRevenue)}</p>
              </div>
            </div>
          </div>

          {stats.lowStockCount > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-amber-200 dark:border-amber-800/30 group">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-red-50 dark:bg-red-900/20 rounded-2xl p-4 group-hover:scale-110 transition-transform">
                  <AlertTriangle className="h-7 w-7 text-red-600 dark:text-red-400" />
                </div>
                <div className="ml-5">
                  <p className="text-xs font-black uppercase tracking-widest text-amber-500 dark:text-amber-400 mb-1">Low Stock</p>
                  <p className="text-3xl font-black text-red-600 dark:text-red-400 font-mono">{stats.lowStockCount}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mb-10">
          <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-slate-500 mb-6 flex items-center">
            <span className="w-8 h-px bg-gray-200 dark:bg-slate-800 mr-4" />
            {t('quickAccess')}
            <span className="ml-4 flex-grow h-px bg-gray-200 dark:bg-slate-800" />
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 p-8 border border-gray-100 dark:border-slate-800 group relative overflow-hidden"
              >
                <div className={`absolute -right-4 -bottom-4 w-24 h-24 ${action.color} opacity-5 rounded-full group-hover:scale-150 transition-transform duration-700`} />
                <div className="flex flex-col">
                  <div className={`w-14 h-14 ${action.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-gray-200 dark:shadow-none group-hover:rotate-6 transition-transform`}>
                    <action.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">{action.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{action.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Recent Products */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight italic">Recent Products</h3>
              <Link to="/admin/products" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">View All</Link>
            </div>
            <div className="p-8">
              {products.length > 0 ? (
                <div className="space-y-6">
                  {products.slice(-4).reverse().map((product) => (
                    <div key={product.id} className="flex items-center justify-between group">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-100 dark:bg-slate-800 rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700">
                          <img src={product.image} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-gray-900 dark:text-white">{product.name}</p>
                          <p className="text-xs font-bold text-blue-600 dark:text-blue-400 font-mono">{formatPrice(product.price)}</p>
                        </div>
                      </div>
                      <div className="flex space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          to={`/admin/products/edit/${product.id}`}
                          className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        >
                          <Edit size={18} />
                        </Link>
                        <button className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <Package className="h-12 w-12 text-gray-300 dark:text-slate-800 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 font-bold">No products created yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Categories */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight italic">Recent Categories</h3>
              <Link to="/admin/categories" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">View All</Link>
            </div>
            <div className="p-8">
              {categories.length > 0 ? (
                <div className="space-y-6">
                  {categories.slice(-4).reverse().map((category) => (
                    <div key={category.id} className="flex items-center justify-between group">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-xl">
                          {category.icon ? <span>{category.icon}</span> : <Grid3x3 size={20} className="text-gray-400" />}
                        </div>
                        <div>
                          <p className="text-sm font-black text-gray-900 dark:text-white">{category.name}</p>
                          <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">
                            {products.filter(p => p.categoryId === category.id).length} products
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          to={`/admin/categories/edit/${category.id}`}
                          className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        >
                          <Edit size={18} />
                        </Link>
                        <button className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <Grid3x3 className="h-12 w-12 text-gray-300 dark:text-slate-800 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 font-bold">No categories created yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
