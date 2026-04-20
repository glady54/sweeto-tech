import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStoreData } from '../contexts/StoreDataContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useToast } from '../contexts/ToastContext';
import { Heart, ShoppingCart, Eye, MessageCircle } from 'lucide-react';
import WhatsAppButton from '../components/WhatsAppButton';
import { updateSEO } from '../utils/seoHelper';
import { useEffect } from 'react';


const CategoryPage = () => {
  const { categoryName } = useParams();
  const { products, categories, formatPrice } = useStoreData();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();

  // Find category object by name
  const category = categories.find(c => c.name.toLowerCase() === decodeURIComponent(categoryName).toLowerCase());

  const decodedName = decodeURIComponent(categoryName).toLowerCase();

  // Find child category IDs and Names
  const childCategoryIds = categories
    .filter(c => c.parentCategory && c.parentCategory.toLowerCase() === decodedName)
    .map(c => c.id);
  const childCategoryNames = categories
    .filter(c => c.parentCategory && c.parentCategory.toLowerCase() === decodedName)
    .map(c => c.name.toLowerCase());

  const categoryProducts = products.filter(product => {
    if (product.status !== 'active') return false;

    // Direct match (product belongs to exact category)
    if (product.categoryId === category?.id || product.category?.toLowerCase() === decodedName) return true;

    // Child category match (product belongs to a sub-category)
    if (childCategoryIds.includes(product.categoryId)) return true;
    if (product.category && childCategoryNames.includes(product.category.toLowerCase())) return true;

    return false;
  });

  useEffect(() => {
    updateSEO({
      title: `${decodeURIComponent(categoryName)} | Sweeto Hubs`,
      description: `Explore the best selection of ${decodeURIComponent(categoryName)} at Sweeto Hubs. Cyber-premium electronics delivered to you.`,
      type: 'website'
    });
  }, [categoryName]);

  return (
    <div className="py-8 bg-gray-50 dark:bg-slate-950 min-h-screen transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8 p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{decodeURIComponent(categoryName)}</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {categoryProducts.length} products found in this category
          </p>
        </div>

        {/* Products Grid */}
        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categoryProducts.map((product) => (
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
                    <WhatsAppButton product={product} iconOnly={true} type="inquiry" className="w-9 h-9" />

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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No products found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto">
              We couldn't find any active products in this category. Check back later!
            </p>
            <Link
              to="/"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-200 dark:shadow-none translate-y-0 hover:-translate-y-1"
            >
              Explore Other Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;

