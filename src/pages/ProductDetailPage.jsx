import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useToast } from '../contexts/ToastContext';
import { useStoreData } from '../contexts/StoreDataContext';
import { ChevronLeft, Plus, Minus, ShoppingCart, X, Maximize2, Heart, MessageCircle } from 'lucide-react';
import WhatsAppButton from '../components/WhatsAppButton';
import { updateSEO } from '../utils/seoHelper';
import { useEffect } from 'react';


const ProductDetailPage = () => {
  const { productId } = useParams();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();
  const { products, categories, formatPrice } = useStoreData();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  
  const product = products.find(p => p.id === productId || p.id.toString() === productId);
  const category = categories.find(c => c.id === product?.categoryId);

  useEffect(() => {
    if (product) {
      updateSEO({
        title: `${product.name} | Sweeto Hubs`,
        description: product.tagline || product.description?.substring(0, 160),
        image: product.image,
        type: 'product'
      });
    }
  }, [product]);

  if (!product || product.status !== 'active' || product.stockQuantity <= 0) {
    return (
      <div className="py-8 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Product Not Available</h3>
            <p className="text-gray-600 mb-6">
              The product you're looking for is currently out of stock or unavailable.
            </p>
            <Link
              to="/"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    showToast(`Added ${quantity} ${product.name} to cart`);
  };

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity(prev => Math.max(1, prev - 1));
  };

  return (
    <div className="py-8 bg-gray-50 dark:bg-slate-950 min-h-screen transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center text-sm font-medium">
          <Link to="/" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
            Home
          </Link>
          <span className="text-gray-400 dark:text-gray-600 mx-2">/</span>
          <Link to={`/category/${encodeURIComponent(category?.name || 'Uncategorized')}`} className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
            {category?.name || 'Uncategorized'}
          </Link>
          <span className="text-gray-400 dark:text-gray-600 mx-2">/</span>
          <span className="text-gray-600 dark:text-gray-400">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image Gallery */}
          <div className="space-y-4">
            <div 
              className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-gray-100 dark:border-slate-800 shadow-sm flex items-center justify-center relative group cursor-pointer"
              onClick={() => setIsLightboxOpen(true)}
            >
              <img
                src={activeImage || product.image}
                alt={product.name}
                className="w-full h-[500px] object-contain transition-all duration-300 transform group-hover:scale-105"
              />
              <div className="absolute top-4 right-4 bg-black/10 backdrop-blur-md p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 size={20} className="text-gray-800 dark:text-gray-200" />
              </div>
            </div>
            
            {/* Thumbnail Gallery */}
            {product.additionalImages && product.additionalImages.length > 0 && (
              <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                {[product.image, ...product.additionalImages].map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(imgUrl)}
                    className={`shrink-0 w-24 h-24 rounded-2xl border-2 overflow-hidden transition-all duration-300 ${
                      (activeImage || product.image) === imgUrl 
                        ? 'border-blue-600 shadow-lg shadow-blue-500/30 ring-2 ring-blue-500/50' 
                        : 'border-transparent hover:border-gray-300 dark:hover:border-slate-700 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt={`${product.name} view ${idx + 1}`} className="w-full h-full object-contain bg-white dark:bg-slate-900" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-gray-100 dark:border-slate-800 shadow-sm">
            <div className="flex flex-wrap gap-2 mb-4">
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="bg-red-500 text-white text-[10px] px-3 py-1 rounded-full font-black shadow-lg uppercase tracking-widest animate-pulse">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </span>
              )}
              {product.badge && (
                <span className="bg-blue-600 text-white text-[10px] px-3 py-1 rounded-full font-black shadow-lg uppercase tracking-widest">
                  {product.badge}
                </span>
              )}
            </div>
            
            <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4 leading-tight">{product.name}</h1>
            
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">{product.tagline}</p>
            
            <div className="flex items-end gap-3 mb-8">
              <div className="text-4xl font-black text-blue-600 dark:text-blue-400">
                {formatPrice(product.price)}
              </div>
              {product.originalPrice && product.originalPrice > product.price && (
                <div className="text-xl font-bold text-gray-400 dark:text-gray-500 line-through mb-1">
                  {formatPrice(product.originalPrice)}
                </div>
              )}
            </div>

            <div className="mb-8 p-6 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Description</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{product.description}</p>
            </div>

            {/* Quantity Selector */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Quantity</h3>
              <div className="flex items-center space-x-6">
                <div className="flex items-center bg-gray-100 dark:bg-slate-800 rounded-xl p-1 border border-gray-200 dark:border-slate-700">
                  <button
                    onClick={decreaseQuantity}
                    className="p-3 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors disabled:opacity-30"
                    disabled={quantity <= 1}
                  >
                    <Minus size={20} />
                  </button>
                  <span className="px-6 py-2 font-black text-xl text-gray-900 dark:text-white">{quantity}</span>
                  <button
                    onClick={increaseQuantity}
                    className="p-3 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-500 font-medium">Subtotal</div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">{formatPrice(product.price * quantity)}</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                className="flex-grow bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black text-xl transition-all shadow-xl shadow-blue-200 dark:shadow-none flex items-center justify-center space-x-3 transform active:scale-95"
              >
                <ShoppingCart size={24} />
                <span>Add to Cart</span>
              </button>
              
              <WhatsAppButton product={product} />
              
              <button
                onClick={() => {
                  toggleWishlist(product);
                  if (!isInWishlist(product.id)) showToast(`Added ${product.name} to wishlist`);
                }}
                className={`px-6 py-4 rounded-2xl border-2 transition-all flex items-center justify-center transform active:scale-95 ${
                  isInWishlist(product.id)
                    ? 'bg-red-50 border-red-200 text-red-600'
                    : 'bg-white border-gray-100 text-gray-400 hover:text-red-500 hover:border-red-100'
                }`}
                title={isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
              >
                <Heart size={24} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Product Info */}
            <div className="mt-8 pt-8 border-t border-gray-100 dark:border-slate-800">
              <div className="grid grid-cols-2 gap-6 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-500 block mb-1">Category</span>
                  <span className="font-bold text-gray-900 dark:text-white">{category?.name || 'Uncategorized'}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-500 block mb-1">Availability</span>
                  <span className="font-bold text-green-600 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    In Stock
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-white dark:bg-slate-900 rounded-3xl p-8 border border-gray-100 dark:border-slate-800 shadow-sm">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-10 text-center uppercase tracking-widest">Product Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-8">
              <div className="p-6 bg-gray-50 dark:bg-slate-800/30 rounded-2xl">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <span className="w-1.5 h-6 bg-blue-600 rounded-full mr-3"></span>
                  General Features
                </h3>
                <ul className="text-gray-600 dark:text-gray-400 space-y-3">
                  <li className="flex items-center"><span className="w-1.5 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full mr-3"></span>High-quality build materials</li>
                  <li className="flex items-center"><span className="w-1.5 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full mr-3"></span>Latest technology integration</li>
                  <li className="flex items-center"><span className="w-1.5 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full mr-3"></span>User-friendly interface</li>
                </ul>
              </div>
              <div className="p-6 bg-gray-50 dark:bg-slate-800/30 rounded-2xl">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <span className="w-1.5 h-6 bg-blue-600 rounded-full mr-3"></span>
                  Technical Details
                </h3>
                <ul className="text-gray-600 dark:text-gray-400 space-y-3">
                  <li className="flex items-center"><span className="w-1.5 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full mr-3"></span>Advanced processing power</li>
                  <li className="flex items-center"><span className="w-1.5 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full mr-3"></span>Energy efficient design</li>
                  <li className="flex items-center"><span className="w-1.5 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full mr-3"></span>Compatibility with major platforms</li>
                </ul>
              </div>
            </div>
            <div className="space-y-8">
              <div className="p-6 bg-gray-50 dark:bg-slate-800/30 rounded-2xl">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <span className="w-1.5 h-6 bg-blue-600 rounded-full mr-3"></span>
                  What's in the Box
                </h3>
                <ul className="text-gray-600 dark:text-gray-400 space-y-3">
                  <li className="flex items-center"><span className="w-1.5 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full mr-3"></span>Main product unit</li>
                  <li className="flex items-center"><span className="w-1.5 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full mr-3"></span>Power adapter</li>
                  <li className="flex items-center"><span className="w-1.5 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full mr-3"></span>User manual</li>
                  <li className="flex items-center"><span className="w-1.5 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full mr-3"></span>Warranty card</li>
                </ul>
              </div>
              <div className="p-6 bg-gray-50 dark:bg-slate-800/30 rounded-2xl">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <span className="w-1.5 h-6 bg-blue-600 rounded-full mr-3"></span>
                  Warranty
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  1-year manufacturer warranty covering defects in materials and workmanship.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <button 
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full p-2 transition-all"
          >
            <X size={32} />
          </button>
          
          <div className="w-full h-full max-w-5xl max-h-[90vh] flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img 
              src={activeImage || product.image} 
              alt={product.name} 
              className="max-w-full max-h-[80vh] object-contain mb-8 rounded-lg shadow-2xl"
            />
            
            {/* Lightbox Thumbnails */}
            {product.additionalImages && product.additionalImages.length > 0 && (
              <div className="flex gap-4 overflow-x-auto pb-4 max-w-full">
                {[product.image, ...product.additionalImages].map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImage(imgUrl);
                    }}
                    className={`shrink-0 w-20 h-20 rounded-xl border-2 overflow-hidden transition-all duration-300 ${
                      (activeImage || product.image) === imgUrl 
                        ? 'border-white shadow-lg shadow-white/20' 
                        : 'border-transparent opacity-50 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt="Thumbnail view" className="w-full h-full object-contain bg-white dark:bg-slate-900" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
