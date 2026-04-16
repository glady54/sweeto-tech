import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useStoreData } from '../contexts/StoreDataContext';
import { getWhatsAppLink } from '../utils/whatsappHelper';

/**
 * Reusable WhatsApp Chat Button
 * @param {Object} product - The product object
 * @param {boolean} iconOnly - If true, renders as a small floating circle
 * @param {string} className - Additional CSS classes
 */
const WhatsAppButton = ({ product, iconOnly = false, className = '' }) => {
  const { storeSettings, formatPrice } = useStoreData();
  const whatsappNumber = storeSettings?.whatsappNumber;
  const shopName = storeSettings?.shopName || 'Sweeto-Tech';

  const waLink = getWhatsAppLink(
    whatsappNumber, 
    product.name, 
    formatPrice(product.price),
    shopName
  );

  if (!waLink) return null;

  if (iconOnly) {
    return (
      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        className={`w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-slate-900 hover:bg-green-500 hover:text-white transition-all duration-300 ${className}`}
        title="Chat on WhatsApp"
        onClick={(e) => e.stopPropagation()}
      >
        <MessageCircle size={18} />
      </a>
    );
  }

  return (
    <a
      href={waLink}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex-grow bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl font-black text-xl transition-all shadow-xl flex items-center justify-center space-x-3 transform active:scale-95 ${className}`}
    >
      <MessageCircle size={24} className="text-green-400" />
      <span>Chat on WhatsApp</span>
    </a>
  );
};

export default WhatsAppButton;
