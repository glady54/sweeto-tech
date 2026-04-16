import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStoreData } from '../contexts/StoreDataContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useToast } from '../contexts/ToastContext';
import { Heart, ShoppingCart, ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import WhatsAppButton from './WhatsAppButton';

const FeaturedProductsGrid = () => {
  const { products, categories, formatPrice } = useStoreData();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('all');
  const [page, setPage] = useState(0);

  const activeProducts = products.filter(p => p.status === 'active' && p.stockQuantity > 0);
  const saleProducts = activeProducts.filter(p => p.originalPrice && p.originalPrice > p.price);

  // Build tabs from top categories
  const tabCategories = categories.slice(0, 4);
  const tabs = [
    { id: 'all', label: 'All' },
    ...tabCategories.map(c => ({ id: c.id.toString(), label: c.name })),
    { id: 'sale', label: 'On Sale' },
  ];

  const getFiltered = () => {
    if (activeTab === 'all') return activeProducts;
    if (activeTab === 'sale') return saleProducts;
    return activeProducts.filter(p => p.categoryId?.toString() === activeTab);
  };

  const filtered = getFiltered();
  const perPage = 4;
  const totalPages = Math.ceil(filtered.length / perPage);
  const visible = filtered.slice(page * perPage, page * perPage + perPage);

  // Pick the most expensive active product as the featured promo
  const promoProduct = [...activeProducts].sort((a, b) => (b.price || 0) - (a.price || 0))[0];

  if (!products || products.length === 0) return null;

  return (
    <section className="max-w-[1400px] mx-auto px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Featured Products</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="w-8 h-8 rounded-lg border border-gray-200 dark:border-slate-700 flex items-center justify-center text-gray-500 hover:border-blue-500 hover:text-blue-500 disabled:opacity-30 transition-all"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="w-8 h-8 rounded-lg border border-gray-200 dark:border-slate-700 flex items-center justify-center text-gray-500 hover:border-blue-500 hover:text-blue-500 disabled:opacity-30 transition-all"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1 hide-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setPage(0); }}
            className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Layout: Products Grid + Promo Card */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
        {/* Products */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {visible.map(product => (
            <div key={product.id} className="group bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
              {/* Image */}
              <div className="relative bg-gray-50 dark:bg-slate-950 p-4 aspect-square overflow-hidden">
                <Link to={`/product/${product.id}`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                  />
                </Link>
                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="bg-red-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </span>
                  )}
                  {product.badge && (
                    <span className="bg-blue-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                      {product.badge}
                    </span>
                  )}
                </div>
                {/* Quick actions */}
                <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-200">
                  <button
                    onClick={() => { toggleWishlist(product); if (!isInWishlist(product.id)) showToast(`Added to wishlist`); }}
                    className={`w-7 h-7 rounded-full flex items-center justify-center shadow transition-all ${isInWishlist(product.id) ? 'bg-red-500 text-white' : 'bg-white text-gray-700 hover:bg-red-500 hover:text-white'}`}
                  >
                    <Heart size={13} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
                  </button>
                  <button
                    onClick={() => { addToCart(product); showToast(`Added to cart`); }}
                    className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow text-gray-700 hover:bg-blue-600 hover:text-white transition-all"
                  >
                    <ShoppingCart size={13} />
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="p-3 flex flex-col flex-1">
                <Link to={`/product/${product.id}`} className="text-xs font-black text-gray-900 dark:text-white line-clamp-2 hover:text-blue-600 transition-colors leading-snug mb-2">
                  {product.name}
                </Link>
                <div className="mt-auto flex items-center justify-between">
                  <div>
                    <p className="text-sm font-black text-blue-600">{formatPrice(product.price)}</p>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <p className="text-[10px] text-gray-400 line-through">{formatPrice(product.originalPrice)}</p>
                    )}
                  </div>
                  <WhatsAppButton product={product} iconOnly={true} />
                </div>
              </div>
            </div>
          ))}

          {visible.length === 0 && (
            <div className="col-span-4 text-center py-12 text-gray-400">No products in this category yet.</div>
          )}
        </div>

        {/* Promo card */}
        {promoProduct && (
          <div className="hidden lg:flex bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 flex-col justify-between overflow-hidden relative min-h-[280px]">
            <div className="absolute -right-8 -bottom-8 w-44 h-44 bg-white/10 rounded-full" />
            <div className="absolute -right-4 bottom-16 w-24 h-24 bg-white/10 rounded-full" />
            <div>
              <span className="text-blue-200 text-[10px] font-black uppercase tracking-widest flex items-center gap-1"><Zap size={10}/> Featured Pick</span>
              <h3 className="text-white text-xl font-black mt-2 leading-tight">{promoProduct.name}</h3>
              <p className="text-blue-200 text-sm mt-1">WITH BEST SAVINGS & PREMIUM QUALITY</p>
              <p className="text-white text-3xl font-black mt-4">{formatPrice(promoProduct.price)}</p>
            </div>
            <img
              src={promoProduct.image}
              alt={promoProduct.name}
              className="w-full h-36 object-contain drop-shadow-2xl mt-4"
            />
            <Link
              to={`/product/${promoProduct.id}`}
              className="mt-4 inline-block bg-white text-blue-600 rounded-xl py-2.5 text-center text-xs font-black uppercase tracking-widest hover:bg-blue-50 transition-all"
            >
              Shop Now →
            </Link>
          </div>
        )}
      </div>

      <style>{`.hide-scrollbar::-webkit-scrollbar{display:none}.hide-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>
    </section>
  );
};

export default FeaturedProductsGrid;
