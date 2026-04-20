import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useStoreData } from '../contexts/StoreDataContext';
import { getWhatsAppLink, getInquiryWhatsAppLink } from '../utils/whatsappHelper';

/**
 * Reusable WhatsApp Button
 * @param {Object} product - The product object
 * @param {boolean} iconOnly - If true, renders as a small circle
 * @param {string} type - 'order' or 'inquiry'
 * @param {string} className - Additional CSS classes
 */
const WhatsAppButton = ({ product, iconOnly = false, type = 'order', className = '' }) => {
  const { storeSettings, formatPrice } = useStoreData();
  const whatsappNumber = storeSettings?.whatsappNumber;
  const shopName = storeSettings?.shopName || 'Sweeto-Tech';

  const waLink = type === 'order' 
    ? getWhatsAppLink(whatsappNumber, product.name, formatPrice(product.price), shopName, product.image)
    : getInquiryWhatsAppLink(whatsappNumber, product.name, shopName, product.image);

  if (!whatsappNumber) {
    // If we're on a product detail page (not iconOnly), show a "Configure WhatsApp" button for the admin
    if (!iconOnly) {
      return (
        <div className={`flex-grow bg-gray-100 dark:bg-slate-800 text-gray-400 px-8 py-4 rounded-2xl font-bold text-sm border-2 border-dashed border-gray-200 dark:border-slate-700 flex flex-col items-center justify-center ${className}`}>
           <span className="text-[10px] uppercase tracking-widest mb-1 opacity-60">WhatsApp Not Configured</span>
           <span className="text-[9px] italic">Set number in Admin Settings</span>
        </div>
      );
    }
    return null;
  }

  if (!waLink) return null;

  if (iconOnly) {
    const isInquiry = type === 'inquiry';
    return (
      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        className={`w-10 h-10 ${isInquiry ? 'bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400' : 'bg-white text-slate-900'} shadow-lg rounded-full flex items-center justify-center hover:bg-green-500 hover:text-white transition-all duration-300 ${className}`}
        title={isInquiry ? "Check Availability" : "Chat on WhatsApp"}
        onClick={(e) => e.stopPropagation()}
      >
        <MessageCircle size={18} />
      </a>
    );
  }

  const isOrder = type === 'order';

  return (
    <a
      href={waLink}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex-grow ${isOrder ? 'bg-slate-900 hover:bg-slate-800' : 'bg-green-600 hover:bg-green-700'} text-white px-8 py-4 rounded-2xl font-black text-xl transition-all shadow-xl flex items-center justify-center space-x-3 transform active:scale-95 ${className}`}
    >
      <MessageCircle size={24} className={isOrder ? "text-green-400" : "text-white"} />
      <span>{isOrder ? 'Chat on WhatsApp' : 'Check Availability'}</span>
    </a>
  );
};

export default WhatsAppButton;
