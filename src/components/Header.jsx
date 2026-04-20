import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useLocale } from '../contexts/LocaleContext';
import { useStoreData } from '../contexts/StoreDataContext';
import { useTheme } from '../contexts/ThemeContext';
import { useUserAuth } from '../contexts/UserAuthContext';
import { Search, ShoppingCart, Package, Sun, Moon, Heart, Menu, X, ChevronDown, Phone, Globe, User, LogOut } from 'lucide-react';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  
  const { cartCount, cartTotal } = useCart();
  const { wishlistCount } = useWishlist();
  const { t } = useLocale();
  const { storeSettings, categories, formatPrice } = useStoreData();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { user, isAuthenticated, isAdmin, logout } = useUserAuth();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsMobileSearchOpen(false);
    }
  };

  return (
    <header className="bg-white dark:bg-slate-900 transition-colors sticky top-0 z-[100] shadow-md">
      {/* Middle Bar - Main Header */}
      <div className="max-w-[1400px] mx-auto px-4 py-4 lg:py-6">
        <div className="flex justify-between items-center gap-4 lg:gap-8">
          
          {/* Mobile Menu & Search Toggles */}
          <div className="flex lg:hidden items-center gap-2">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              <Menu size={24} />
            </button>
            <button 
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              <Search size={22} />
            </button>
          </div>

          {/* Logo */}
          <div className="flex items-center gap-8 flex-1 lg:flex-none justify-center lg:justify-start">
            <Link to="/" className="flex items-center flex-shrink-0">
              {storeSettings.shopLogo ? (
                <img src={storeSettings.shopLogo} alt={storeSettings.shopName} className="h-8 lg:h-10 w-auto" />
              ) : (
                <div className="flex items-center group scale-75 sm:scale-90 lg:scale-100 origin-left">
                  <div className="h-[32px] w-[32px] shrink-0 bg-[#2563eb] rounded-[8px] flex items-center justify-center mr-[10px] shadow-[0_0_15px_rgba(37,99,235,0.5)] shine-effect transform transition-transform group-hover:scale-105 perspective-1000">
                    <Package className="h-[18px] w-[18px] text-white relative z-10 animate-spin-y" strokeWidth={2.5} />
                  </div>
                  <div className="flex items-baseline whitespace-nowrap animate-chill">
                    <span className="text-[26px] leading-none font-[900] text-[#0f172a] dark:text-white uppercase italic tracking-[-0.02em] pr-[1px]">
                      {storeSettings.shopName || 'STORE'}
                    </span>
                    <span className="text-[26px] leading-none font-[900] text-[#2563eb] italic tracking-[-0.05em]">.</span>
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

          {/* Massive Search Bar (Desktop) */}
          <div className="hidden lg:block flex-1 max-w-2xl">
            <form onSubmit={handleSearch} className="relative group">
              <div className="flex items-center border-2 border-gray-200 dark:border-slate-800 rounded-full overflow-hidden hover:border-blue-600 dark:hover:border-blue-500 transition-all bg-white dark:bg-slate-900">
                <select 
                  className="bg-transparent border-r border-gray-100 dark:border-slate-800 px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 outline-none cursor-pointer hover:text-blue-600 transition-colors min-w-[180px]"
                >
                  <option>Select category</option>
                  {categories.map(cat => (
                    <option key={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <input
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
          <div className="flex items-center space-x-2 lg:space-x-6">
            <Link to="/wishlist" className="hidden sm:flex items-center relative group text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors">
              <Heart size={24} strokeWidth={1.5} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center border border-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Customer Account */}
            {isAuthenticated ? (
              <div className="hidden sm:flex items-center group relative">
                <button className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors">
                  <User size={24} strokeWidth={1.5} />
                  <div className="text-left hidden lg:block">
                    <p className="text-[10px] leading-tight font-medium text-gray-400 uppercase">Account</p>
                    <p className="text-xs font-bold uppercase tracking-wider">{isAdmin ? 'Admin' : (user?.displayName?.split(' ')[0] || 'User')}</p>
                  </div>
                </button>
                <div className="absolute top-10 right-0 w-56 bg-white dark:bg-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 dark:border-slate-800 rounded-3xl p-3 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all transform origin-top-right scale-95 group-hover:scale-100 z-50">
                  <div className="px-4 py-3 mb-2 border-b border-gray-50 dark:border-slate-800">
                    <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest">{user?.displayName || 'User'}</p>
                    <p className="text-[10px] text-gray-400 truncate">{user?.email}</p>
                  </div>
                  
                  {isAdmin && (
                    <Link to="/admin" className="w-full text-left px-4 py-3 text-xs font-black uppercase tracking-widest text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10 rounded-2xl flex items-center gap-3 transition-colors mb-1">
                      <Package size={16} /> Admin Panel
                    </Link>
                  )}

                  <button onClick={logout} className="w-full text-left px-4 py-3 text-xs font-black uppercase tracking-widest text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl flex items-center gap-3 transition-colors">
                    <LogOut size={16} /> Sign out
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="hidden sm:flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors gap-2">
                <User size={24} strokeWidth={1.5} />
                <span className="text-xs font-bold uppercase hidden lg:block text-nowrap">Sign In</span>
              </Link>
            )}

            <button onClick={toggleDarkMode} className="hidden sm:block p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors">
              {isDarkMode ? <Sun size={24} strokeWidth={1.5} /> : <Moon size={24} strokeWidth={1.5} />}
            </button>

            <Link to="/cart" className="flex items-center gap-2 lg:gap-3 group text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors border-l border-gray-100 dark:border-slate-800 pl-2 lg:pl-6">
              <div className="relative">
                <ShoppingCart size={24} lg:size={28} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-bold rounded-full h-4 lg:h-5 w-4 lg:w-5 flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm">
                  {cartCount}
                </span>
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-[11px] leading-tight font-medium text-gray-400 uppercase">Cart</p>
                <p className="text-xs font-bold uppercase tracking-wider">{formatPrice(cartTotal || 0)}</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Mobile Search Bar (Expandable) */}
        {isMobileSearchOpen && (
          <div className="mt-4 lg:hidden animate-in slide-in-from-top duration-300">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-100 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 outline-none text-gray-900 dark:text-white placeholder-gray-400 font-medium"
              />
              <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-600">
                <Search size={22} />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Navigation Drawer */}
      <div className={`fixed inset-0 z-[200] lg:hidden transition-all duration-500 ${isMobileMenuOpen ? 'visible' : 'invisible'}`}>
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-500 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
        
        {/* Menu Content */}
        <div className={`absolute top-0 left-0 bottom-0 w-[300px] bg-white dark:bg-slate-900 shadow-2xl transition-transform duration-500 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex flex-col h-full p-6">
            <div className="flex justify-between items-center mb-10">
              <span className="text-xl font-black text-gray-900 dark:text-white italic tracking-tighter">MENU</span>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 bg-gray-100 dark:bg-slate-800 rounded-xl text-gray-500"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex flex-col gap-2">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl text-gray-900 dark:text-white font-black uppercase text-xs tracking-widest">
                Home <ChevronDown size={14} className="-rotate-90" />
              </Link>
              <Link to="/search" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl text-gray-900 dark:text-white font-black uppercase text-xs tracking-widest">
                Explore All <ChevronDown size={14} className="-rotate-90" />
              </Link>
              <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl text-gray-900 dark:text-white font-black uppercase text-xs tracking-widest">
                My Wishlist <ChevronDown size={14} className="-rotate-90" />
              </Link>

              {/* Mobile Dark Mode Toggle */}
              <button 
                onClick={toggleDarkMode} 
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl text-gray-900 dark:text-white font-black uppercase text-xs tracking-widest"
              >
                {isDarkMode ? 'Light Mode' : 'Dark Mode'} 
                {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
              </button>

              {isAuthenticated ? (
                <>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between p-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest mt-4 shadow-lg shadow-indigo-600/20">
                      Admin Panel <Package size={16} />
                    </Link>
                  )}
                  <button 
                    onClick={() => { logout(); setIsMobileMenuOpen(false); }} 
                    className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/10 text-red-600 rounded-2xl font-black uppercase text-xs tracking-widest mt-2"
                  >
                    Sign Out <LogOut size={16} />
                  </button>
                </>
              ) : (
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between p-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest mt-4 shadow-lg shadow-blue-600/20">
                  Sign In <User size={16} />
                </Link>
              )}
            </nav>

            <div className="mt-auto pt-10">
              <div className="p-6 bg-slate-950 rounded-3xl border border-slate-800">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 mb-2">Customer Support</p>
                <p className="text-white font-black text-sm tracking-tight mb-4">{storeSettings.shopPhone || '+1-800-SWEETO'}</p>
                <div className="h-px bg-slate-800 mb-4"></div>
                <p className="text-gray-400 text-[10px] leading-relaxed">
                  Need help with your order? Our team is available 24/7.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;


