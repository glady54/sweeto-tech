import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStoreData } from '../contexts/StoreDataContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useToast } from '../contexts/ToastContext';
import { ShoppingCart, Star, Heart, ArrowRight } from 'lucide-react';

const TrendingProducts = () => {
  const { products, formatPrice } = useStoreData();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('new');

  const tabs = [
    { id: 'new', label: 'New Products' },
    { id: 'all', label: 'Best Sellers' },
    { id: 'featured', label: 'Trending' },
  ];

  const getFilteredProducts = () => {
    if (!products || products.length === 0) return [];
    const activeProducts = products.filter(p => p.status === 'active' && p.stockQuantity > 0);

    switch (activeTab) {
      case 'new':
        return [...activeProducts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 8);
      case 'featured':
        return activeProducts.slice(0, 8);
      default:
        return activeProducts.slice(0, 8);
    }
  };

  const filteredProducts = getFilteredProducts();

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="max-w-[1400px] mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">Trending Now</h2>
        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative py-2 text-sm font-black uppercase tracking-widest transition-all ${
                activeTab === tab.id
                  ? 'text-blue-600'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-full animate-in slide-in-from-left-1/2 duration-300"></span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredProducts.map((product) => (
          <div key={product.id} className="group flex flex-col transition-all duration-300">
            {/* Image Container */}
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-slate-50 border border-slate-100 mb-6">
              <Link to={`/product/${product.id}`} className="block h-full w-full p-8">
                <div className="image-straight">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
              </Link>
              
              {/* Overlay Actions */}
              <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                <button 
                  onClick={() => {
                    toggleWishlist(product);
                    if (!isInWishlist(product.id)) showToast(`Added ${product.name} to wishlist`);
                  }}
                  className={`w-10 h-10 shadow-lg rounded-full flex items-center justify-center transition-all duration-300 ${
                    isInWishlist(product.id) 
                      ? 'bg-red-500 text-white border-red-500' 
                      : 'bg-white text-slate-900 border-white hover:bg-blue-600 hover:text-white'
                  }`}
                >
                  <Heart size={18} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
                </button>
                <button 
                  onClick={() => {
                    addToCart(product);
                    showToast(`Added ${product.name} to cart`);
                  }}
                  className="w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-slate-900 hover:bg-blue-600 hover:text-white transition-all duration-300"
                >
                  <ShoppingCart size={18} />
                </button>
              </div>

              {/* Badge */}
              {product.badge && (
                <div className="absolute top-4 left-4">
                  <span className="bg-slate-900 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-xl">
                    {product.badge}
                  </span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="px-2">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex text-yellow-400">
                  <Star size={12} className="fill-current" />
                  <Star size={12} className="fill-current" />
                  <Star size={12} className="fill-current" />
                  <Star size={12} className="fill-current" />
                  <Star size={12} className="fill-current opacity-30" />
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  ({product.reviewsCount || (parseInt(String(product.id).slice(-2)) || 0) + 15} Reviews)
                </span>
              </div>
              
              <Link to={`/product/${product.id}`} className="block text-lg font-black text-slate-900 mb-2 line-clamp-1 hover:text-blue-600 transition-colors tracking-tighter">
                {product.name}
              </Link>
              
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xl font-black text-blue-600">{formatPrice(product.price)}</span>
                  <span className="text-[10px] font-bold text-slate-400 line-through">
                    {formatPrice(product.price * 1.2)}
                  </span>
                </div>
                <Link to={`/product/${product.id}`} className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-16 text-center">
        <Link to="/shop" className="inline-flex items-center gap-3 bg-slate-900 text-white px-10 py-5 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-blue-600 transition-all hover:gap-5 shadow-2xl">
          Discover More Products <ArrowRight size={20} />
        </Link>
      </div>
    </section>
  );
};

export default TrendingProducts;

