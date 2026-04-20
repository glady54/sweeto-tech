import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUserAuth } from './UserAuthContext';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = React.useState([]);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const { user } = useUserAuth();

  // Load cart from localStorage or Firestore on mount/login
  useEffect(() => {
    const loadCart = async () => {
      setIsLoaded(false);
      let localCart = [];
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          localCart = JSON.parse(savedCart);
        } catch (error) {
          console.error('Error parsing cart from localStorage:', error);
        }
      }

      if (user && user.email !== 'sweeto@sweeto.com') {
        try {
          const docRef = doc(db, 'customerCarts', user.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const cloudCart = docSnap.data().items || [];
            
            // Basic Merge: If local cart exists, prioritize it and sync it up
            if (localCart.length > 0) {
              setCartItems(localCart);
              // Will sync to cloud in the next useEffect
            } else {
              setCartItems(cloudCart);
            }
          } else {
            // New user without a cloud cart yet, keep local
            setCartItems(localCart);
          }
        } catch (error) {
          console.error("Error fetching cloud cart", error);
          setCartItems(localCart);
        }
      } else {
        setCartItems(localCart);
      }
      setIsLoaded(true);
    };

    loadCart();
  }, [user]);

  // Save cart to localStorage OR cloud when it changes
  useEffect(() => {
    if (!isLoaded) return; // Prevent overwriting cloud with empty state on login

    if (cartItems.length > 0 || localStorage.getItem('cart')) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
    
    // Sync to cloud if logged in
    if (user && user.email !== 'sweeto@sweeto.com') {
      const syncToCloud = async () => {
        try {
          await setDoc(doc(db, 'customerCarts', user.uid), { items: cartItems });
        } catch (error) {
          console.error("Error syncing cart to cloud:", error);
        }
      };
      
      const debounce = setTimeout(() => {
        syncToCloud();
      }, 500); // Debounce typing/rapid clicks

      return () => clearTimeout(debounce);
    }
  }, [cartItems, user, isLoaded]);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev => prev.map(item =>
      item.id === productId ? { ...item, quantity } : item
    ));
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const value = {
    cartItems,
    cartCount,
    cartTotal,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
