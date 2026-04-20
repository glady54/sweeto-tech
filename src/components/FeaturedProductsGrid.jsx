import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStoreData } from '../contexts/StoreDataContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useToast } from '../contexts/ToastContext';
import { Heart, ShoppingCart, ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import WhatsAppButton from './WhatsAppButton';

const FeaturedProductsGrid = () => {
  const { products, categories, formatPrice, videoAds } = useStoreData();
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

  // Pick the most expensive active product as the featured promo fallback
  const promoProduct = [...activeProducts].sort((a, b) => (b.price || 0) - (a.price || 0))[0];

  // Pick the most recently added active video advert
  const activeVideoAd = videoAds && videoAds.length > 0 
    ? [...videoAds].filter(ad => ad.isActive).reverse()[0] 
    : null;

  if (!products || products.length === 0) return null;

  return (
    <section className="w-full max-w-[1400px] mx-auto px-2 sm:px-4">
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
            className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Layout: Products Grid + Promo Card */}
      <div className="w-full flex flex-col gap-6 sm:gap-8">
        {/* Products - Fixed 2-column grid with strict width control mb-6 */}
        <div className="grid grid-cols-[repeat(2,minmax(0,1fr))] md:grid-cols-4 gap-2 sm:gap-4 w-full">
          {visible.map(product => (
            <div key={product.id} className="group bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl sm:rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col min-w-0 w-full relative">
              {/* Image */}
              <div className="relative bg-gray-50 dark:bg-slate-950 p-1 sm:p-4 aspect-square overflow-hidden flex items-center justify-center">
                <Link to={`/product/${product.id}`} className="w-full h-full flex items-center justify-center p-1">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500"
                  />
                </Link>
                {/* Badges */}
                <div className="absolute top-1 left-1 flex flex-col gap-1">
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="bg-red-500 text-white text-[7px] sm:text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </span>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="p-2 sm:p-3 flex flex-col flex-1 min-w-0">
                <Link to={`/product/${product.id}`} className="text-[10px] sm:text-xs font-black text-gray-900 dark:text-white line-clamp-1 hover:text-blue-600 transition-colors leading-tight mb-1 sm:mb-2 break-words">
                  {product.name}
                </Link>
                <div className="mt-auto flex items-center justify-between gap-1">
                  <div className="flex flex-col min-w-0">
                    <p className="text-[10px] sm:text-sm font-black text-blue-600 tracking-tighter truncate">{formatPrice(product.price)}</p>
                  </div>
                  <WhatsAppButton product={product} iconOnly={true} type="inquiry" />
                </div>
              </div>
            </div>
          ))}

          {visible.length === 0 && (
            <div className="col-span-4 text-center py-12 text-gray-400">No products in this category yet.</div>
          )}
        </div>

        {/* Promo card */}
        {activeVideoAd ? (
          <div className="flex bg-black rounded-xl sm:rounded-2xl p-0 flex-col justify-between overflow-hidden relative min-h-[320px] md:min-h-[400px] w-full group shadow-2xl">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline
              src={activeVideoAd.videoUrl}
              className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40 pointer-events-none" />
            
            <div className="relative z-10 p-4 sm:p-6 flex flex-col h-full justify-between pointer-events-none">
              <div className="mt-2">
                <span className="bg-pink-600 text-white px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg inline-flex items-center backdrop-blur-md border border-pink-500/50"><Zap size={12} className="mr-1.5" /> Featured</span>
              </div>
              <div className="mt-auto pointer-events-auto">
                <h3 className="text-white text-2xl sm:text-3xl font-black leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">{activeVideoAd.title}</h3>
                {activeVideoAd.productId && products.find(p => p.id === activeVideoAd.productId) ? (
                  <Link
                    to={`/product/${activeVideoAd.productId}`}
                    className="mt-5 inline-block bg-white text-pink-600 rounded-xl px-6 py-3 text-center text-xs font-black uppercase tracking-widest hover:bg-pink-50 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all"
                  >
                    Shop Now →
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        ) : promoProduct && (
          <div className="flex bg-gradient-to-br from-blue-600 to-indigo-900 rounded-xl sm:rounded-2xl p-6 sm:p-10 flex-col md:flex-row justify-between items-center overflow-hidden relative min-h-[320px] w-full group">
            <div className="absolute -right-8 -bottom-8 w-64 h-64 bg-blue-500/20 rounded-full blur-2xl" />
            <div className="absolute left-1/2 bottom-16 w-32 h-32 bg-purple-500/20 rounded-full blur-xl" />
            
            <div className="relative z-10 md:w-1/2 flex flex-col justify-center items-start text-left w-full">
              <span className="text-blue-200 text-xs font-black uppercase tracking-widest flex items-center gap-1.5"><Zap size={14} /> Featured Pick</span>
              <h3 className="text-white text-3xl md:text-5xl font-black mt-3 leading-tight">{promoProduct.name}</h3>
              <p className="text-blue-200 text-sm md:text-base font-bold mt-2 tracking-wide uppercase">WITH BEST SAVINGS & PREMIUM QUALITY</p>
              <p className="text-white text-4xl md:text-5xl font-black mt-6 tracking-tighter">{formatPrice(promoProduct.price)}</p>
              
              <Link
                to={`/product/${promoProduct.id}`}
                className="relative z-10 mt-8 inline-block bg-white text-blue-900 rounded-2xl px-10 py-4 text-center text-sm font-black uppercase tracking-widest hover:bg-blue-50 hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95 transition-all w-full md:w-auto"
              >
                Shop Now →
              </Link>
            </div>
            
            <div className="w-full md:w-1/2 mt-8 md:mt-0 flex justify-center items-center relative z-10">
              <img
                src={promoProduct.image}
                alt={promoProduct.name}
                className="w-full max-w-[280px] md:max-w-[400px] h-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.4)] group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-700"
              />
            </div>
          </div>
        )}
      </div>

      <style>{`.hide-scrollbar::-webkit-scrollbar{display:none}.hide-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>
    </section>
  );
};

export default FeaturedProductsGrid;
