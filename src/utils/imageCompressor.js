export const compressImage = async (file, maxWidth = 1200, maxHeight = 1200) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions while maintaining aspect ratio
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          
          // Fill white background (useful for transparent PNGs converted to JPEG)
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
          
          ctx.drawImage(img, 0, 0, width, height);

          // Get the data URL with quality adjustment
          // Use a slightly higher quality for 'premium' feel but keep it efficient
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          
          // Safety check: if the result is somehow empty or invalid
          if (!compressedDataUrl || compressedDataUrl === 'data:,') {
            throw new Error('Canvas export failed');
          }
          
          resolve(compressedDataUrl);
        } catch (error) {
          console.error('Image compression error:', error);
          // Fallback: return original if it's small enough, or reject
          if (file.size < 2 * 1024 * 1024) { // 2MB
             resolve(event.target.result);
          } else {
             reject(new Error('Failed to process large image. Try a smaller file.'));
          }
        }
      };
      img.onerror = () => reject(new Error('Failed to load image into memory'));
    };
    reader.onerror = () => reject(new Error('Failed to read file contents'));
  });
};
