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

/**
 * Helper to generate a WhatsApp link for checking availability
 * @param {string} phone - The WhatsApp number
 * @param {string} productName - Name of the product
 * @param {string} shopName - Name of the shop
 * @param {string} imageUrl - Product image URL
 * @returns {string} - The WhatsApp URL
 */
export const getInquiryWhatsAppLink = (phone, productName, shopName = 'SWEETO-HUB', imageUrl = '') => {
  if (!phone) return null;
  
  const cleanPhone = phone.replace(/\D/g, '');
  let message = '';
  
  if (imageUrl && imageUrl.startsWith('http')) {
    message += `${imageUrl}\n\n`;
  }
  
  message += `*🙋‍♂️ AVAILABILITY INQUIRY - ${shopName.toUpperCase()}*\n`;
  message += `━━━━━━━━━━━━━━━━━━\n`;
  message += `Hello! I'm interested in the following product:\n\n`;
  message += `*Product:* ${productName}\n\n`;
  message += `Is this item currently available in stock?\n`;
  message += `━━━━━━━━━━━━━━━━━━\n`;
  message += `_Sent from Sweeto-Tech Storefront_`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
};

/**
 * Helper to generate a WhatsApp link for the entire cart
 * @param {string} phone - The WhatsApp number
 * @param {Array} items - Array of cart items
 * @param {number} total - Total price
 * @param {string} shopName - Name of the shop
 * @param {function} formatPrice - Price formatter function
 * @returns {string} - The WhatsApp URL
 */
export const getCartWhatsAppLink = (phone, items, total, shopName = 'SWEETO-HUB', formatPrice) => {
  if (!phone || !items || items.length === 0) return null;

  const cleanPhone = phone.replace(/\D/g, '');
  let message = '';

  // Add the first item's image at the top to trigger WhatsApp preview
  if (items[0].image && items[0].image.startsWith('http')) {
    message += `${items[0].image}\n\n`;
  }

  message += `*📦 NEW ORDER - ${shopName.toUpperCase()}*\n`;
  message += `━━━━━━━━━━━━━━━━━━\n`;
  message += `*Items:*\n`;

  items.forEach(item => {
    message += `• ${item.name} (x${item.quantity}) - ${formatPrice(item.price * item.quantity)}\n`;
  });

  message += `━━━━━━━━━━━━━━━━━━\n`;
  message += `*Total Amount: ${formatPrice(total)}*\n\n`;
  message += `_Generated via Sweeto-Tech Storefront_`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
};
