import { supabase } from '../supabase';

/**
 * Uploads a file (Blob or File) to Supabase Storage and returns the public URL.
 * Requires the bucket (folder) to exist and have public access or appropriate RLS policies.
 * @param {Blob|File} file - The file to upload
 * @param {string} bucketName - The bucket in storage (e.g., 'products', 'video-ads')
 * @returns {Promise<string>} - The public URL
 */
export const uploadToStorage = async (file, bucketName) => {
  if (!file) return null;
  
  // Ensure we have a proper filename
  const fileName = file.name || `${Date.now()}.jpg`;
  const filePath = `${Date.now()}_${fileName}`;
  
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      if (error.message.includes('Bucket not found')) {
        throw new Error(`Supabase Storage Error: Bucket "${bucketName}" not found. Please create it in the Supabase Dashboard.`);
      }
      throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error(`Error uploading to ${bucketName}:`, error);
    throw error;
  }
};
