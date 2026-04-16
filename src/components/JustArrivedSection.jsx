import React from 'react';
import { Link } from 'react-router-dom';
import { useStoreData } from '../contexts/StoreDataContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useToast } from '../contexts/ToastContext';
import { Heart, ShoppingCart, Percent } from 'lucide-react';
import WhatsAppButton from './WhatsAppButton';

const JustArrivedSection = () => {
  const { products, formatPrice } = useStoreData();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();

  const newProducts = [...products]
    .filter(p => p.status === 'active' && p.stockQuantity > 0)
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 5);

  if (newProducts.length === 0) return null;

  return (
    <section className="max-w-[1400px] mx-auto px-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Just Arrived</h2>
        <Link to="/search?q=new" className="text-xs font-black text-blue-500 uppercase tracking-widest hover:text-blue-700 transition-colors">
          VIEW ALL →
        </Link>
      </div>

      {/* Layout: Products + Promo Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-6">
        {/* Horizontal product strip */}
        <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
          {newProducts.map(product => (
            <div
              key={product.id}
              className="group flex-none w-[180px] bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              {/* Image */}
              <div className="relative bg-gray-50 dark:bg-slate-950 p-4 h-[150px] flex items-center justify-center overflow-hidden">
                <Link to={`/product/${product.id}`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-[120px] object-contain group-hover:scale-110 transition-transform duration-500"
                  />
                </Link>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                )}
                {/* Quick actions on hover */}
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
              <div className="p-3 flex-1 flex flex-col">
                <Link to={`/product/${product.id}`} className="text-xs font-black text-gray-900 dark:text-white line-clamp-2 hover:text-blue-600 transition-colors leading-snug mb-2">
                  {product.name}
                </Link>
                <div className="mt-auto">
                  <p className="text-sm font-black text-blue-600">{formatPrice(product.price)}</p>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <p className="text-[10px] text-gray-400 line-through">{formatPrice(product.originalPrice)}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Discount promo banner */}
        <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 overflow-hidden relative min-h-[220px]">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-blue-500/20 rounded-full" />
          <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-indigo-500/20 rounded-full" />
          <div className="relative z-10">
            <span className="text-white/60 text-[10px] font-black uppercase tracking-widest">SHOP ALL!</span>
            <div className="flex items-center gap-2 mt-2">
              <div className="bg-blue-500 rounded-xl p-2">
                <Percent size={24} className="text-white" />
              </div>
              <div>
                <p className="text-white text-3xl font-black leading-none">35%</p>
                <p className="text-blue-300 text-xs font-bold">Save up to</p>
              </div>
            </div>
            <p className="text-white/70 text-sm mt-3">on Weekly Discounts</p>
          </div>
          {/* Pick a random sale product image */}
          {products.find(p => p.originalPrice && p.originalPrice > p.price && p.status === 'active') && (
            <img
              src={products.find(p => p.originalPrice && p.originalPrice > p.price && p.status === 'active').image}
              alt="Sale"
              className="w-32 h-28 object-contain drop-shadow-2xl self-end relative z-10"
            />
          )}
          <Link
            to="/search?q=sale"
            className="relative z-10 mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2.5 text-center text-xs font-black uppercase tracking-widest transition-all"
          >
            Shop Now →
          </Link>
        </div>
      </div>

      <style>{`.hide-scrollbar::-webkit-scrollbar{display:none}.hide-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>
    </section>
  );
};

export default JustArrivedSection;
