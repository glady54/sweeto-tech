import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';

/**
 * Uploads a file (Blob or File) to Firebase Storage and returns the download URL
 * @param {Blob|File} file - The file to upload
 * @param {string} folder - The folder in storage (e.g., 'products', 'categories')
 * @returns {Promise<string>} - The public download URL
 */
export const uploadToStorage = async (file, folder) => {
  if (!file) return null;
  
  // Ensure we have a proper filename. If it's a blob from canvas, it might not have one.
  const fileName = file.name || `${Date.now()}.jpg`;
  const storageRef = ref(storage, `${folder}/${Date.now()}_${fileName}`);
  
  try {
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error(`Error uploading to ${folder}:`, error);
    throw error;
  }
};
