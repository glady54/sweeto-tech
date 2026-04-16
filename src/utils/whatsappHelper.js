/**
 * Helper to generate a WhatsApp link with a pre-filled message
 * @param {string} phone - The WhatsApp number
 * @param {string} productName - Name of the product
 * @param {string} productPrice - Formatted price of the product
 * @param {string} shopName - Name of the shop
 * @returns {string} - The WhatsApp URL
 */
export const getWhatsAppLink = (phone, productName, productPrice, shopName = 'Sweeto-Tech') => {
  if (!phone) return null;
  
  // Clean phone number (remove +, spaces, -, etc.)
  const cleanPhone = phone.replace(/\D/g, '');
  
  const message = `Hi ${shopName}! I'm interested in *${productName}* (${productPrice}). Is this available?`;
  const encodedMessage = encodeURIComponent(message);
  
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
};
