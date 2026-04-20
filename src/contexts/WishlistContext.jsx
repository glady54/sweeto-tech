import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUserAuth } from './UserAuthContext';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { user } = useUserAuth();

  // Load wishlist from localStorage or Firestore on mount/login
  useEffect(() => {
    const loadWishlist = async () => {
      setIsLoaded(false);
      let localWishlist = [];
      const savedWishlist = localStorage.getItem('wishlist');
      if (savedWishlist) {
        try {
          localWishlist = JSON.parse(savedWishlist);
        } catch (error) {
          console.error('Error parsing wishlist from localStorage:', error);
        }
      }

      if (user && user.email !== 'sweeto@sweeto.com') {
        try {
          const docRef = doc(db, 'customerWishlists', user.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const cloudWishlist = docSnap.data().items || [];
            
            // Basic Merge: If local exists, prioritize it and sync it up
            if (localWishlist.length > 0) {
              setWishlistItems(localWishlist);
            } else {
              setWishlistItems(cloudWishlist);
            }
          } else {
            setWishlistItems(localWishlist);
          }
        } catch (error) {
          console.error("Error fetching cloud wishlist", error);
          setWishlistItems(localWishlist);
        }
      } else {
        setWishlistItems(localWishlist);
      }
      setIsLoaded(true);
    };

    loadWishlist();
  }, [user]);

  // Save wishlist to localStorage OR cloud when it changes
  useEffect(() => {
    if (!isLoaded) return; // Prevent overwriting cloud with empty state on login

    if (wishlistItems.length > 0 || localStorage.getItem('wishlist')) {
      localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
    }
    
    // Sync to cloud if logged in
    if (user && user.email !== 'sweeto@sweeto.com') {
      const syncToCloud = async () => {
        try {
          await setDoc(doc(db, 'customerWishlists', user.uid), { items: wishlistItems });
        } catch (error) {
          console.error("Error syncing wishlist to cloud:", error);
        }
      };
      
      const debounce = setTimeout(() => {
        syncToCloud();
      }, 500); 

      return () => clearTimeout(debounce);
    }
  }, [wishlistItems, user, isLoaded]);

  const toggleWishlist = (product) => {
    setWishlistItems(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        // Remove if exists
        return prev.filter(item => item.id !== product.id);
      } else {
        // Add if not exists
        return [...prev, product];
      }
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems(prev => prev.filter(item => item.id !== productId));
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.id === productId);
  };

  const wishlistCount = wishlistItems.length;

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      toggleWishlist,
      removeFromWishlist,
      isInWishlist,
      wishlistCount
    }}>
      {children}
    </WishlistContext.Provider>
  );
};
