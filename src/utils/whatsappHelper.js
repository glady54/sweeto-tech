/**
 * Helper to generate a WhatsApp link with a pre-filled message
 * @param {string} phone - The WhatsApp number
 * @param {string} productName - Name of the product
 * @param {string} productPrice - Formatted price of the product
 * @param {string} shopName - Name of the shop
 * @returns {string} - The WhatsApp URL
 */
export const getWhatsAppLink = (phone, productName, productPrice, shopName = 'SWEETO-HUB', imageUrl = '') => {
  if (!phone) return null;
  
  // Clean phone number (remove +, spaces, -, etc.)
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Build the message following the exact requested format
  let message = '';
  
  // Start with the image URL to trigger WhatsApp link preview
  if (imageUrl && imageUrl.startsWith('http')) {
    message += `${imageUrl}\n\n`;
  }
  
  message += `*📦 NEW ORDER - ${shopName.toUpperCase()}*\n`;
  message += `━━━━━━━━━━━━━━━━━━\n`;
  message += `*Items:*\n`;
  message += `• ${productName} (x1) - ${productPrice}\n`;
  message += `━━━━━━━━━━━━━━━━━━\n`;
  message += `*Total Amount: ${productPrice}*\n\n`;
  message += `_Generated via Sweeto-Tech Storefront_`;

  const encodedMessage = encodeURIComponent(message);
  
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
};
