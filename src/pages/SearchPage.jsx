import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Heart, ShoppingCart, Eye, MessageCircle } from 'lucide-react';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';
import WhatsAppButton from '../components/WhatsAppButton';
import { useStoreData } from '../contexts/StoreDataContext';
import { updateSEO } from '../utils/seoHelper';
import { useEffect } from 'react';


const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { products, categories, formatPrice } = useStoreData();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();


  const searchResults = products.filter(product => {
    if (product.status !== 'active') return false;
    
    const categoryName = categories.find(c => c.id === product.categoryId)?.name || '';
    const searchTerm = query.toLowerCase();
    
    return (
      (product.name || '').toLowerCase().includes(searchTerm) ||
      categoryName.toLowerCase().includes(searchTerm) ||
      (product.tagline || '').toLowerCase().includes(searchTerm)
    );
  });

  useEffect(() => {
    updateSEO({
      title: `Search: ${query} | Sweeto Hubs`,
      description: `Search results for "${query}" at Sweeto Hubs. Find the best electronics at the best prices.`,
      type: 'website'
    });
  }, [query]);

  return (
    <div className="py-8 bg-gray-50 dark:bg-slate-950 min-h-screen transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header */}
        <div className="mb-8 p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Search Results</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {searchResults.length} products found for <span className="text-blue-600 dark:text-blue-400 font-bold">"{query}"</span>
          </p>
        </div>

        {/* Results */}
        {searchResults.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {searchResults.map((product) => (
              <div
                key={product.id}
                className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-slate-800 group"
              >
                <div className="relative overflow-hidden">
                  <Link to={`/product/${product.id}`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </Link>
                  <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="bg-red-500 text-white text-[10px] px-2 py-1 rounded-full font-black shadow-lg uppercase tracking-widest animate-pulse">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                      </span>
                    )}
                    {product.badge && (
                      <span className="bg-blue-600 text-white text-[10px] px-2.5 py-1 rounded-full font-black shadow-lg uppercase tracking-widest">
                        {product.badge}
                      </span>
                    )}
                  </div>

                  {/* Quick Actions (Floating Circles) */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2 translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 z-10">
                    <button 
                      onClick={() => {
                        toggleWishlist(product);
                        if (!isInWishlist(product.id)) showToast(`Added ${product.name} to wishlist`);
                      }}
                      className={`w-9 h-9 shadow-lg rounded-full flex items-center justify-center transition-all duration-300 ${
                        isInWishlist(product.id) 
                          ? 'bg-red-500 text-white border-red-500' 
                          : 'bg-white text-slate-900 border-white hover:bg-blue-600 hover:text-white'
                      }`}
                    >
                      <Heart size={16} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
                    </button>
                    <button 
                      onClick={() => {
                        addToCart(product);
                        showToast(`Added ${product.name} to cart`);
                      }}
                      className="w-9 h-9 bg-white shadow-lg rounded-full flex items-center justify-center text-slate-900 hover:bg-blue-600 hover:text-white transition-all duration-300"
                    >
                      <ShoppingCart size={16} />
                    </button>
                    <WhatsAppButton product={product} iconOnly={true} className="w-9 h-9" />
                    <Link 
                      to={`/product/${product.id}`}
                      className="w-9 h-9 bg-white shadow-lg rounded-full flex items-center justify-center text-slate-900 hover:bg-blue-600 hover:text-white transition-all duration-300"
                    >
                      <Eye size={16} />
                    </Link>
                  </div>

                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
                    <Link to={`/product/${product.id}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      {product.name}
                    </Link>
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2 h-10">{product.tagline}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-slate-800">
                    <div className="flex flex-col">
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-[10px] font-bold text-gray-400 line-through mb-0.5">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                      <span className="text-xl font-black text-blue-600 dark:text-blue-400">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                    <Link
                      to={`/product/${product.id}`}
                      className="text-gray-400 hover:text-blue-600 dark:text-gray-500 dark:hover:text-blue-400 transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-gray-200 dark:border-slate-800 shadow-sm">
            <div className="text-gray-300 dark:text-slate-700 mb-6 flex justify-center">
              <svg className="w-32 h-32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No products found for your search</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto">
              Try searching with different keywords or browse our categories to find what you're looking for.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                to="/"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-200 dark:shadow-none translate-y-0 hover:-translate-y-1"
              >
                Back to Home
              </Link>
              <Link
                to="/category/Smart Phones"
                className="bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-900 dark:text-white border border-gray-300 dark:border-slate-700 px-8 py-3 rounded-xl font-bold transition-all"
              >
                Browse Categories
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;

