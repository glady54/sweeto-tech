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
  
  // Putting the image at the top helps WhatsApp generate a rich link preview
  if (imageUrl) {
    message += `${imageUrl}\n\n`;
  }

  message += `*New Order from ${shopName}*\n`;
  message += `------------------\n`;
  message += `*Items:*\n`;
  message += `- ${productName} (x1) - ${productPrice}\n`;
  message += `------------------\n`;
  message += `*Total: ${productPrice}*\n\n`;
  message += `_Generated via Sweeto-Tech Storefront_`;

  const encodedMessage = encodeURIComponent(message);
  
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
};
