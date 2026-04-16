import React from 'react';
import { useCart } from '../contexts/CartContext';
import { useStoreData } from '../contexts/StoreDataContext';
import { Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Plus, Minus, Trash2, MessageSquare } from 'lucide-react';

const CartPage = () => {
  const { cartItems, cartCount, cartTotal, removeFromCart, updateQuantity } = useCart();
  const { storeSettings, formatPrice } = useStoreData();

  const handleWhatsAppCheckout = () => {
    const whatsappNumber = storeSettings?.whatsappNumber;

    if (!whatsappNumber) {
      alert("WhatsApp checkout is currently unavailable. Please check store settings.");
      return;
    }

    let message = `*New Order from ${storeSettings.shopName || 'SWEETO-HUB'}*\n`;
    message += `------------------\n`;
    message += `*Items:*\n`;
    
    cartItems.forEach(item => {
      message += `- ${item.name} (x${item.quantity}) - ${formatPrice(item.price * item.quantity)}\n`;
    });
    
    message += `------------------\n`;
    message += `*Total: ${formatPrice(cartTotal)}*\n\n`;
    message += `_Generated via Sweeto-Tech Storefront_`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\+/g, '')}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="py-8 bg-gray-50 dark:bg-slate-950 min-h-screen transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-6 transition-colors group"
          >
            <ArrowLeft size={20} className="mr-2 transform group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Shopping</span>
          </Link>
          <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800">
            <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">Shopping Cart</h1>
            <p className="text-gray-500 dark:text-gray-400 flex items-center">
              <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-bold mr-2">
                {cartCount} {cartCount === 1 ? 'item' : 'items'}
              </span>
              ready for review
            </p>
          </div>
        </div>

        {/* Cart Content */}
        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-800 flex items-center space-x-6 hover:shadow-md transition-all duration-300"
                >
                  <div className="relative group shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-contain rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{item.name}</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-1">{item.tagline}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-black text-blue-600 dark:text-blue-400 block font-mono">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                        {item.quantity > 1 && (
                          <span className="text-xs text-slate-400 font-bold block">{formatPrice(item.price)} each</span>
                        )}
                      </div>
                    </div>
                    <div className="mt-6 flex items-center justify-between">
                      <div className="flex items-center bg-gray-50 dark:bg-slate-800 p-1 rounded-xl border border-gray-100 dark:border-slate-700">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2 text-slate-500 hover:text-blue-600 transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-10 text-center font-black text-slate-900 dark:text-white">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 text-slate-500 hover:text-blue-600 transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="flex items-center gap-2 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 text-sm font-bold transition-all hover:bg-red-50 dark:hover:bg-red-900/10 px-3 py-2 rounded-xl"
                      >
                        <Trash2 size={16} />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none p-8 sticky top-24 border border-gray-100 dark:border-slate-800">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Order Summary</h2>
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 dark:text-gray-400">Subtotal ({cartCount} items)</span>
                    <span className="font-bold text-gray-900 dark:text-white font-mono">
                      {formatPrice(cartTotal)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Estimated Shipping</span>
                    <span className="text-blue-600 dark:text-blue-400 font-bold uppercase">Calculated at Checkout</span>
                  </div>
                </div>
                <div className="border-t border-gray-100 dark:border-slate-800 pt-6 mb-8">
                  <div className="flex justify-between items-end">
                    <span className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-tighter">Total Amount</span>
                    <span className="text-3xl font-black text-blue-600 dark:text-blue-400 font-mono">
                      {formatPrice(cartTotal)}
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  <button
                    onClick={handleWhatsAppCheckout}
                    className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-2xl font-black transition-all shadow-lg shadow-green-500/30 hover:-translate-y-1 uppercase tracking-widest text-sm flex items-center justify-center gap-2"
                  >
                    <MessageSquare size={20} />
                    Checkout via WhatsApp
                  </button>
                  <p className="text-sm text-gray-400 dark:text-slate-500 text-center px-4">
                    Order processing will be finalized securely through our WhatsApp concierge.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-gray-200 dark:border-slate-800 shadow-sm">
            <div className="text-gray-300 dark:text-slate-800 mb-8 flex justify-center">
              <div className="p-8 bg-gray-50 dark:bg-slate-950 rounded-full relative">
                <ShoppingCart size={80} strokeWidth={1} />
                <div className="absolute top-0 right-0 w-8 h-8 bg-blue-600 rounded-full border-4 border-white dark:border-slate-900 animate-pulse" />
              </div>
            </div>
            <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-4">Your cart is empty</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-10 max-w-sm mx-auto text-lg font-medium">
              Explore our premium tech collection and add some amazing gadgets to your sanctuary.
            </p>
            <Link
              to="/"
              className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-2xl font-black transition-all shadow-xl shadow-blue-500/30 hover:-translate-y-1 inline-block uppercase tracking-widest text-sm"
            >
              Start Discovering
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
