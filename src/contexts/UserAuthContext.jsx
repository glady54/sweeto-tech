import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';
import LoadingScreen from '../components/LoadingScreen';

const UserAuthContext = createContext();

export const useUserAuth = () => {
  const context = useContext(UserAuthContext);
  if (!context) {
    throw new Error('useUserAuth must be used within a UserAuthProvider');
  }
  return context;
};

export const UserAuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const startTime = Date.now();
    const MINIMUM_LOADING_MS = 2000; // 2 seconds

    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      setIsAuthenticated(!!currentUser);
      
      const elapsed = Date.now() - startTime;
      const remainingTime = MINIMUM_LOADING_MS - elapsed;
      if (remainingTime > 0) {
        setTimeout(() => setLoading(false), remainingTime);
      } else {
        setLoading(false);
      }
    });

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      setIsAuthenticated(!!currentUser);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error("Customer Login Error:", error);
      let errorMessage = 'Invalid email or password';
      if (error.message.includes('Invalid login credentials')) errorMessage = 'Account not found or incorrect password.';
      else if (error.status === 429) errorMessage = 'Too many attempts. Try again later.';
      return { success: false, error: errorMessage };
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: name,
          }
        }
      });

      if (error) throw error;
      
      // Update local state is handled by onAuthStateChange usually, 
      // but if email confirmation is required, the user might not be "logged in" yet.
      return { success: true };
    } catch (error) {
      console.error("Customer Registration Error:", error);
      let errorMessage = 'Could not create account';
      if (error.message.includes('User already registered')) errorMessage = 'This email is already registered.';
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const isAdmin = user?.email === 'sweeto@sweeto.com';

  const value = {
    isAuthenticated,
    isAdmin,
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <UserAuthContext.Provider value={value}>
      {loading ? <LoadingScreen /> : children}
    </UserAuthContext.Provider>
  );
};
