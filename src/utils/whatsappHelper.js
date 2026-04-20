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
  
  const cleanPhone = phone.replace(/\D/g, '');
  let message = '';
  
  if (imageUrl && imageUrl.startsWith('http')) {
    message += `${imageUrl}\n\n`;
  }
  
  message += `🛒 *ORDER REQUEST - ${shopName.toUpperCase()}*\n`;
  message += `━━━━━━━━━━━━━━━━━━\n`;
  message += `Hello! I would like to order:\n\n`;
  message += `🏷️ *${productName}*\n`;
  message += `💰 *Price:* ${productPrice}\n`;
  message += `━━━━━━━━━━━━━━━━━━\n`;
  message += `✨ _Sent via Sweeto-Tech premium storefront_`;

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
  
  message += `🙋‍♂️ *AVAILABILITY INQUIRY - ${shopName.toUpperCase()}*\n`;
  message += `━━━━━━━━━━━━━━━━━━\n`;
  message += `Hello! I'm interested in this item:\n\n`;
  message += `📦 *Product:* ${productName}\n\n`;
  message += `Is this currently available in stock?\n`;
  message += `━━━━━━━━━━━━━━━━━━\n`;
  message += `✨ _Sent via Sweeto-Tech premium storefront_`;

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

  if (items[0].image && items[0].image.startsWith('http')) {
    message += `${items[0].image}\n\n`;
  }

  message += `🛒 *NEW CART ORDER - ${shopName.toUpperCase()}*\n`;
  message += `━━━━━━━━━━━━━━━━━━\n`;
  message += `Hello! I would like to order the following items:\n\n`;

  items.forEach(item => {
    message += `🏷️ *${item.name}*\n`;
    message += `   Quantity: ${item.quantity} × ${formatPrice(item.price)}\n`;
    message += `   Subtotal: ${formatPrice(item.price * item.quantity)}\n\n`;
  });

  message += `━━━━━━━━━━━━━━━━━━\n`;
  message += `💰 *TOTAL AMOUNT: ${formatPrice(total)}*\n`;
  message += `━━━━━━━━━━━━━━━━━━\n`;
  message += `✨ _Sent via Sweeto-Tech premium storefront_`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
};
