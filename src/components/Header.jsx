import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useLocale } from '../contexts/LocaleContext';
import { useStoreData } from '../contexts/StoreDataContext';
import { useTheme } from '../contexts/ThemeContext';
import { useUserAuth } from '../contexts/UserAuthContext';
import { Search, ShoppingCart, Package, Sun, Moon, Heart, Menu, ChevronDown, Phone, Globe, User, LogOut } from 'lucide-react';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const { cartCount, cartTotal } = useCart();
  const { wishlistCount } = useWishlist();
  const { t } = useLocale();
  const { storeSettings, categories, formatPrice } = useStoreData();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { user, isAuthenticated, logout } = useUserAuth();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="bg-white dark:bg-slate-900 transition-colors sticky top-0 z-[100] shadow-md">


      {/* Middle Bar - Main Header */}
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        <div className="flex justify-between items-center gap-8">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center flex-shrink-0">
              {storeSettings.shopLogo ? (
                <img src={storeSettings.shopLogo} alt={storeSettings.shopName} className="h-10 w-auto" />
              ) : (
                <div className="flex items-center group">
                  <div className="h-[32px] w-[32px] shrink-0 bg-[#2563eb] rounded-[8px] flex items-center justify-center mr-[10px] shadow-[0_0_15px_rgba(37,99,235,0.5)] shine-effect transform transition-transform group-hover:scale-105 perspective-1000">
                    <Package className="h-[18px] w-[18px] text-white relative z-10 animate-spin-y" strokeWidth={2.5} />
                  </div>
                  <div className="flex items-baseline whitespace-nowrap animate-chill">
                    <span className="text-[28px] leading-none font-[900] text-[#0f172a] dark:text-white uppercase italic tracking-[-0.05em]">
                      S
                    </span>
                    <span className="text-[22px] leading-none font-[900] text-[#0f172a] dark:text-white uppercase italic tracking-[-0.05em]">
                      WEETO-
                    </span>
                    <span className="text-[28px] leading-none font-[900] text-[#0f172a] dark:text-white uppercase italic tracking-[-0.05em]">
                      T
                    </span>
                    <span className="text-[22px] leading-none font-[900] text-[#0f172a] dark:text-white uppercase italic tracking-[-0.05em] pr-[1px]">
                      ECH
                    </span>
                    <span className="text-[22px] leading-none font-[900] text-[#2563eb] italic tracking-[-0.05em]">.</span>
                  </div>
                </div>
              )}
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden xl:flex items-center space-x-6 text-[12px] font-black uppercase tracking-widest text-gray-500">
              <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
              <Link to="/shop" className="hover:text-blue-600 transition-colors">Shop</Link>
            </nav>
          </div>

          {/* Massive Search Bar */}
          <div className="hidden lg:block flex-1 max-w-2xl">
            <form onSubmit={handleSearch} className="relative group">
              <div className="flex items-center border-2 border-gray-200 dark:border-slate-800 rounded-full overflow-hidden hover:border-blue-600 dark:hover:border-blue-500 transition-all bg-white dark:bg-slate-900">
                <select 
                  id="header-category-select"
                  name="category"
                  className="bg-transparent border-r border-gray-100 dark:border-slate-800 px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 outline-none cursor-pointer hover:text-blue-600 transition-colors min-w-[180px]"
                >
                  <option>Select category</option>
                  {categories.map(cat => (
                    <option key={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <input
                  id="header-search-input"
                  name="search"
                  type="text"
                  placeholder="Search for products"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-6 py-3 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400 text-sm"
                />
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 transition-colors flex items-center gap-2 font-bold">
                  <Search size={20} />
                </button>
              </div>
            </form>
          </div>

          {/* Action Icons */}
          <div className="flex items-center space-x-1 lg:space-x-6">
            {/* Wishlist */}
            <Link to="/wishlist" className="hidden sm:flex items-center relative group text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors">
              <Heart size={24} strokeWidth={1.5} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center border border-white shadow-sm animate-in zoom-in duration-300">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Customer Account */}
            {isAuthenticated && user && user.email !== 'sweeto@sweeto.com' ? (
              <div className="hidden sm:flex items-center ml-2 border-l border-gray-100 dark:border-slate-800 pl-4 group relative">
                <button className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors">
                  <User size={24} strokeWidth={1.5} />
                  <span className="text-xs font-bold uppercase hidden lg:block">{user.displayName || 'Profile'}</span>
                </button>
                <div className="absolute top-10 right-0 w-48 bg-white dark:bg-slate-900 shadow-xl border border-gray-100 dark:border-slate-800 rounded-2xl p-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all transform origin-top-right scale-95 group-hover:scale-100 z-50">
                  <p className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 break-words">{user.email}</p>
                  <div className="h-px bg-gray-100 dark:bg-slate-800 my-1"></div>
                  <button 
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl flex items-center gap-2 transition-colors"
                  >
                    <LogOut size={16} /> Sign out
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="hidden sm:flex items-center ml-2 mr-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors gap-2">
                <User size={24} strokeWidth={1.5} />
                <span className="text-xs font-bold uppercase hidden lg:block">Sign In</span>
              </Link>
            )}

            {/* Theme Toggle */}
            <button onClick={toggleDarkMode} className="p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors">
              {isDarkMode ? <Sun size={24} strokeWidth={1.5} /> : <Moon size={24} strokeWidth={1.5} />}
            </button>

            {/* Cart */}
            <Link to="/cart" className="flex items-center gap-3 group text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors border-l border-gray-100 dark:border-slate-800 lg:pl-6">
              <div className="relative">
                <ShoppingCart size={28} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[11px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm">
                  {cartCount}
                </span>
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-[11px] leading-tight font-medium text-gray-400 uppercase">Shopping Cart</p>
                <p className="text-xs font-bold uppercase tracking-wider">{formatPrice(cartTotal || 0)}</p>
              </div>
            </Link>

            {/* Mobile Menu Toggle */}
            <button className="lg:hidden p-2 text-gray-900 dark:text-white">
              <Menu size={28} />
            </button>
          </div>
        </div>
      </div>

    </header>
  );
};

export default Header;

