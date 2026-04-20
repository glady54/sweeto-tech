import React from 'react';
import { useCart } from '../contexts/CartContext';
import { useStoreData } from '../contexts/StoreDataContext';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getCartWhatsAppLink } from '../utils/whatsappHelper';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const { formatPrice, storeSettings } = useStoreData();

  const handleWhatsAppCheckout = () => {
    const shopName = storeSettings.shopName || 'SWEETO-HUB';
    const phone = storeSettings.whatsappNumber || '237699999999';
    
    const whatsappUrl = getCartWhatsAppLink(
      phone,
      cartItems,
      cartTotal,
      shopName,
      formatPrice
    );

    if (whatsappUrl) {
      window.open(whatsappUrl, '_blank');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 bg-gray-50 dark:bg-slate-950 transition-colors">
        <div className="bg-white dark:bg-slate-900 p-10 lg:p-16 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-slate-800 text-center max-w-lg w-full transform hover:scale-[1.02] transition-transform duration-500">
          <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
            <ShoppingBag className="text-blue-600 dark:text-blue-400" size={40} />
          </div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4 tracking-tighter">Your cart is empty</h2>
          <p className="text-gray-500 dark:text-slate-400 mb-10 text-lg font-medium leading-relaxed">
            Looks like you haven't added anything to your cart yet. Explore our premium tech collection and find something amazing.
          </p>
          <Link 
            to="/" 
            className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition-all shadow-xl shadow-blue-500/30 hover:-translate-y-1 active:translate-y-0"
          >
            Start Shopping <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-gray-50 dark:bg-slate-950 min-h-screen transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-10 gap-4">
          <div className="relative">
            <span className="absolute -top-6 left-0 text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400">Checkout Process</span>
            <h1 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tighter">Shopping Cart</h1>
          </div>
          <button 
            onClick={clearCart}
            className="text-gray-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 text-xs font-black uppercase tracking-widest transition-colors flex items-center gap-2 pb-1 border-b-2 border-transparent hover:border-red-500/30"
          >
            <Trash2 size={14} /> Clear All Items
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-6">
            {cartItems.map((item) => (
              <div 
                key={item.id} 
                className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 lg:p-8 shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-8 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500 group"
              >
                {/* Product Image */}
                <div className="relative shrink-0 w-32 h-32 lg:w-40 lg:h-40 bg-gray-50 dark:bg-slate-950 rounded-2xl flex items-center justify-center p-4 overflow-hidden border border-gray-100 dark:border-slate-800 transition-all group-hover:border-blue-500/30">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-grow text-center sm:text-left space-y-2">
                  <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-4">
                    <div>
                      <h3 className="text-xl lg:text-2xl font-black text-gray-900 dark:text-white mb-1 tracking-tight">{item.name}</h3>
                      <p className="text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]">{item.tagline || 'Premium Selection'}</p>
                    </div>
                    <div className="flex flex-col items-center sm:items-end">
                      <span className="text-2xl font-black text-gray-900 dark:text-white mb-1">{formatPrice(item.price * item.quantity)}</span>
                      {item.quantity > 1 && (
                        <span className="text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase tracking-widest">{formatPrice(item.price)} each</span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-center sm:justify-between gap-6 pt-6 mt-4 border-t border-gray-50 dark:border-slate-800">
                    <div className="flex items-center bg-gray-50 dark:bg-slate-950 p-1.5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-inner">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-blue-600 dark:text-slate-500 dark:hover:text-blue-400 transition-all hover:bg-white dark:hover:bg-slate-800 rounded-xl"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-12 text-center font-black text-lg text-gray-900 dark:text-white">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-blue-600 dark:text-slate-500 dark:hover:text-blue-400 transition-all hover:bg-white dark:hover:bg-slate-800 rounded-xl"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="flex items-center gap-2 text-red-400 hover:text-red-500 dark:text-slate-600 dark:hover:text-red-400 text-[10px] font-black uppercase tracking-widest transition-all px-4 py-2 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl"
                    >
                      <Trash2 size={14} /> Remove Item
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 lg:p-10 shadow-2xl border border-gray-100 dark:border-slate-800 relative overflow-hidden group">
              {/* Cinematic Background Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-8 tracking-tighter relative z-10">Order Summary</h2>
              
              <div className="space-y-4 mb-8 relative z-10">
                <div className="flex justify-between items-center text-gray-500 dark:text-slate-400 font-medium">
                  <span>Subtotal</span>
                  <span className="text-gray-900 dark:text-white">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between items-center text-gray-500 dark:text-slate-400 font-medium">
                  <span>Delivery fee</span>
                  <span className="text-green-600 dark:text-green-400 font-bold uppercase text-[10px] tracking-widest">Free</span>
                </div>
                <div className="pt-6 mt-6 border-t border-gray-100 dark:border-slate-800 flex justify-between items-center">
                  <span className="text-lg font-black text-gray-900 dark:text-white tracking-tight">Total</span>
                  <span className="text-3xl font-black text-blue-600 dark:text-blue-400">{formatPrice(cartTotal)}</span>
                </div>
              </div>

              <div className="space-y-4 relative z-10">
                <button 
                  onClick={handleWhatsAppCheckout}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition-all shadow-xl shadow-green-500/20 hover:shadow-green-500/40 hover:-translate-y-1 flex items-center justify-center gap-3 active:scale-95 group/btn"
                >
                  <MessageCircle size={20} className="group-hover/btn:rotate-12 transition-transform" /> Checkout with WhatsApp
                </button>
                <Link 
                  to="/" 
                  className="w-full bg-slate-900 dark:bg-slate-800 hover:bg-black dark:hover:bg-slate-700 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition-all flex items-center justify-center gap-2"
                >
                  Continue Shopping
                </Link>
              </div>

              <p className="mt-8 text-center text-gray-400 dark:text-slate-500 text-[9px] font-black uppercase tracking-[0.15em] leading-relaxed relative z-10">
                Fast Processing • Guaranteed Delivery <br />
                Security Powered by WhatsApp
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
